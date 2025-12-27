from odoo import models, fields

class GearGuardMaintenanceTeam(models.Model):
    _name = 'gearguard.maintenance.team'
    _description = 'Maintenance Team'

    name = fields.Char(required=True)
    member_ids = fields.Many2many('res.users', string="Team Members")
