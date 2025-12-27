from odoo import models, fields

class GearGuardEquipment(models.Model):
    _name = 'gearguard.equipment'
    _description = 'Equipment'

    name = fields.Char(required=True)
    serial_number = fields.Char()
    department = fields.Char()
    employee_id = fields.Many2one('res.users', string="Assigned To")
    purchase_date = fields.Date()
    warranty_expiry = fields.Date()
    location = fields.Char()
    team_id = fields.Many2one('gearguard.maintenance.team', string="Maintenance Team")
    is_scrapped = fields.Boolean(default=False)
