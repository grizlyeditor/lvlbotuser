from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import threading
import time
import random
import json
import os
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configuration
CONFIG = {
    'host': '0.0.0.0',
    'port': 5000,
    'debug': True
}

# Data storage
active_deployments = {}
deployment_history = {}
user_stats = {}

class XPManager:
    def __init__(self):
        self.xp_requirements = self.calculate_xp_requirements()
    
    def calculate_xp_requirements(self):
        requirements = {}
        for level in range(1, 101):
            requirements[level] = level * 600
        return requirements
    
    def get_total_xp_for_level(self, level):
        total_xp = 0
        for i in range(1, level):
            total_xp += self.xp_requirements[i]
        return total_xp
    
    def calculate_level_progress(self, current_level, current_xp):
        xp_for_current_level = self.get_total_xp_for_level(current_level)
        xp_for_next_level = xp_for_current_level + self.xp_requirements[current_level]
        
        current_level_xp = current_xp - xp_for_current_level
        xp_needed = self.xp_requirements[current_level]
        progress_percentage = (current_level_xp / xp_needed) * 100
        
        return {
            'current_level_xp': current_level_xp,
            'xp_needed': xp_needed,
            'progress_percentage': progress_percentage,
            'next_level': current_level + 1
        }

class DeploymentManager:
    def __init__(self):
        self.xp_manager = XPManager()
        self.speed_settings = {
            'slow': {'interval': 8, 'xp_gain': (20, 30)},
            'medium': {'interval': 5, 'xp_gain': (45, 55)},
            'fast': {'interval': 2, 'xp_gain': (95, 105)}
        }
    
    def start_deployment(self, deployment_id, uid, region, speed='medium'):
        if deployment_id in active_deployments:
            return False
        
        deployment_data = {
            'uid': uid,
            'region': region,
            'speed': speed,
            'start_time': datetime.now().isoformat(),
            'is_active': True,
            'total_xp_gained': 0,
            'levels_gained': 0,
            'last_update': datetime.now().isoformat()
        }
        
        active_deployments[deployment_id] = deployment_data
        
        # Start deployment thread
        thread = threading.Thread(
            target=self.run_deployment,
            args=(deployment_id, uid, region, speed),
            daemon=True
        )
        thread.start()
        
        logger.info(f"Started deployment {deployment_id} for UID {uid}")
        return True
    
    def stop_deployment(self, deployment_id):
        if deployment_id in active_deployments:
            active_deployments[deployment_id]['is_active'] = False
            logger.info(f"Stopped deployment {deployment_id}")
            return True
        return False
    
    def run_deployment(self, deployment_id, uid, region, speed):
        speed_config = self.speed_settings.get(speed, self.speed_settings['medium'])
        
        while (deployment_id in active_deployments and 
               active_deployments[deployment_id]['is_active']):
            
            try:
                # Simulate API call to get account data
                account_data = self.get_account_data(uid, region)
                
                if account_data and 'AccountInfo' in account_data:
                    current_level = account_data['AccountInfo']['AccountLevel']
                    current_xp = account_data['AccountInfo']['AccountEXP']
                    
                    # Simulate XP gain
                    xp_gain = random.randint(*speed_config['xp_gain'])
                    
                    # Update deployment data
                    active_deployments[deployment_id]['total_xp_gained'] += xp_gain
                    active_deployments[deployment_id]['last_update'] = datetime.now().isoformat()
                    
                    # Calculate progress
                    progress = self.xp_manager.calculate_level_progress(current_level, current_xp)
                    active_deployments[deployment_id]['progress'] = progress
                    
                    # Check for level up simulation
                    if progress['progress_percentage'] + (xp_gain / progress['xp_needed'] * 100) >= 100:
                        active_deployments[deployment_id]['levels_gained'] += 1
                        logger.info(f"Deployment {deployment_id}: Level up achieved!")
                
                # Update user stats
                self.update_user_stats(deployment_id, xp_gain)
                
            except Exception as e:
                logger.error(f"Error in deployment {deployment_id}: {str(e)}")
            
            # Wait for next iteration
            time.sleep(speed_config['interval'])
    
    def get_account_data(self, uid, region):
        try:
            response = requests.get(
                f'https://infoalinwnwn.vercel.app/get?uid={uid}&region={region}',
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"API call failed for UID {uid}: {str(e)}")
            return None
    
    def update_user_stats(self, deployment_id, xp_gained):
        user_id = deployment_id.split('_')[0]  # Extract user ID from deployment ID
        if user_id not in user_stats:
            user_stats[user_id] = {
                'total_xp_gained': 0,
                'total_levels_gained': 0,
                'active_deployments': 0,
                'total_deployment_time': 0
            }
        
        user_stats[user_id]['total_xp_gained'] += xp_gained

# Initialize managers
xp_manager = XPManager()
deployment_manager = DeploymentManager()

# CHANGED: Pehla page login.html hoga
@app.route('/')
def serve_login():
    return send_from_directory('.', 'login.html')

# ADDED: Dashboard route
@app.route('/dashboard')
def serve_dashboard():
    return send_from_directory('.', 'index.html')

# ADDED: Admin route
@app.route('/admin')
def serve_admin():
    return send_from_directory('.', 'admin.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/verify-account', methods=['POST'])
def verify_account():
    try:
        data = request.get_json()
        uid = data.get('uid')
        region = data.get('region', 'BD')
        
        if not uid:
            return jsonify({
                'success': False,
                'error': 'UID is required'
            }), 400
        
        response = requests.get(
            f'https://infoalinwnwn.vercel.app/get?uid={uid}&region={region}',
            timeout=10
        )
        response.raise_for_status()
        account_data = response.json()
        
        if 'AccountInfo' in account_data:
            return jsonify({
                'success': True,
                'data': account_data
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid UID or account not found'
            }), 404
            
    except requests.exceptions.RequestException as e:
        logger.error(f"API request failed: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to verify account: API unavailable'
        }), 503
    except Exception as e:
        logger.error(f"Verification error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/start-deployment', methods=['POST'])
def start_deployment():
    try:
        data = request.get_json()
        deployment_id = data.get('deployment_id')
        uid = data.get('uid')
        region = data.get('region', 'BD')
        speed = data.get('speed', 'medium')
        
        if not all([deployment_id, uid]):
            return jsonify({
                'success': False,
                'error': 'Deployment ID and UID are required'
            }), 400
        
        success = deployment_manager.start_deployment(deployment_id, uid, region, speed)
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Deployment started successfully',
                'deployment_id': deployment_id
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Deployment already running'
            }), 409
            
    except Exception as e:
        logger.error(f"Start deployment error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to start deployment: {str(e)}'
        }), 500

@app.route('/api/stop-deployment', methods=['POST'])
def stop_deployment():
    try:
        data = request.get_json()
        deployment_id = data.get('deployment_id')
        
        if not deployment_id:
            return jsonify({
                'success': False,
                'error': 'Deployment ID is required'
            }), 400
        
        success = deployment_manager.stop_deployment(deployment_id)
        
        if success:
            # Move to history
            if deployment_id in active_deployments:
                deployment_history[deployment_id] = active_deployments.pop(deployment_id)
            
            return jsonify({
                'success': True,
                'message': 'Deployment stopped successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Deployment not found'
            }), 404
            
    except Exception as e:
        logger.error(f"Stop deployment error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to stop deployment: {str(e)}'
        }), 500

@app.route('/api/deployment-status/<deployment_id>')
def deployment_status(deployment_id):
    try:
        if deployment_id in active_deployments:
            return jsonify({
                'success': True,
                'status': 'active',
                'data': active_deployments[deployment_id]
            })
        elif deployment_id in deployment_history:
            return jsonify({
                'success': True,
                'status': 'completed',
                'data': deployment_history[deployment_id]
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Deployment not found'
            }), 404
            
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get deployment status: {str(e)}'
        }), 500

@app.route('/api/user-stats')
def get_user_stats():
    try:
        user_id = request.args.get('user_id')
        if user_id in user_stats:
            return jsonify({
                'success': True,
                'stats': user_stats[user_id]
            })
        else:
            return jsonify({
                'success': True,
                'stats': {
                    'total_xp_gained': 0,
                    'total_levels_gained': 0,
                    'active_deployments': 0,
                    'total_deployment_time': 0
                }
            })
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get user stats: {str(e)}'
        }), 500

@app.route('/api/active-deployments')
def get_active_deployments():
    try:
        return jsonify({
            'success': True,
            'active_deployments': len(active_deployments),
            'deployments': active_deployments
        })
    except Exception as e:
        logger.error(f"Active deployments error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to get active deployments: {str(e)}'
        }), 500

@app.route('/api/calculate-xp-progress', methods=['POST'])
def calculate_xp_progress():
    try:
        data = request.get_json()
        level = data.get('level')
        xp = data.get('xp')
        
        if level is None or xp is None:
            return jsonify({
                'success': False,
                'error': 'Level and XP are required'
            }), 400
        
        progress = xp_manager.calculate_level_progress(level, xp)
        
        return jsonify({
            'success': True,
            'progress': progress
        })
        
    except Exception as e:
        logger.error(f"XP progress calculation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Failed to calculate XP progress: {str(e)}'
        }), 500

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'active_deployments': len(active_deployments),
        'uptime': 'OK'
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    logger.info("Starting LevelUp Dashboard Server...")
    logger.info(f"Server will run on {CONFIG['host']}:{CONFIG['port']}")
    
    app.run(
        host=CONFIG['host'],
        port=CONFIG['port'],
        debug=CONFIG['debug'],
        threaded=True
    )