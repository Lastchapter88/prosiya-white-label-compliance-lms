"""
Audit middleware for automatic logging of all requests.
"""
from .models import AuditLog


class AuditMiddleware:
    """
    Middleware to automatically log all authenticated requests.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # Log after response (so we have status code)
        if request.user.is_authenticated and hasattr(request.user, 'tenant'):
            self.log_request(request, response)
        
        return response
    
    def log_request(self, request, response):
        """Log the request to audit log."""
        try:
            # Determine action from HTTP method
            method_action_map = {
                'GET': 'read',
                'POST': 'create',
                'PUT': 'update',
                'PATCH': 'update',
                'DELETE': 'delete',
            }
            action = method_action_map.get(request.method, 'read')
            
            # Extract resource info from path
            path_parts = request.path.strip('/').split('/')
            resource_type = path_parts[1] if len(path_parts) > 1 else 'unknown'
            resource_id = path_parts[2] if len(path_parts) > 2 else 'list'
            
            # Get IP address
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0]
            else:
                ip_address = request.META.get('REMOTE_ADDR', '0.0.0.0')
            
            # Create audit log
            AuditLog.objects.create(
                user=request.user,
                tenant=request.user.tenant,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                description=f"{request.method} {request.path}",
                metadata={
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code,
                    'query_params': dict(request.GET),
                },
                ip_address=ip_address,
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
            )
        except Exception as e:
            # Don't break the request if audit logging fails
            print(f"Audit logging error: {e}")
