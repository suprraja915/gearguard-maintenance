from odoo import models, fields, api

class GearGuardMaintenanceRequest(models.Model):
    _name = 'gearguard.maintenance.request'
    _description = 'Maintenance Request'

    name = fields.Char(required=True)
    equipment_id = fields.Many2one('gearguard.equipment')
    team_id = fields.Many2one('gearguard.maintenance.team')
    technician_id = fields.Many2one('res.users', string="Technician")

    request_type = fields.Selection([
        ('corrective', 'Corrective'),
        ('preventive', 'Preventive')
    ], default='corrective')

    scheduled_date = fields.Date()
    duration = fields.Float(string="Hours Spent")

    state = fields.Selection([
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('repaired', 'Repaired'),
        ('scrap', 'Scrap')
    ], default='new')

    @api.onchange('equipment_id')
    def _onchange_equipment(self):
        if self.equipment_id:
            self.team_id = self.equipment_id.team_id

    def action_scrap(self):
        for rec in self:
            rec.state = 'scrap'
            if rec.equipment_id:
                rec.equipment_id.is_scrapped = True
