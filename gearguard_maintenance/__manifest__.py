{
    'name': 'GearGuard Maintenance',
    'version': '1.0',
    'summary': 'Equipment and Maintenance Tracker',
    'category': 'Operations',
    'author': 'Supraja Maddukuri',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/equipment_views.xml',
        'views/team_views.xml',
        'views/request_views.xml',
    ],
    'application': True,
}
