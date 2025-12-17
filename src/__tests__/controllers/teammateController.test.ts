import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import teammateController from '../../controllers/teammateController.js';
import Teammate from '../../models/teammate.js';

vi.mock('../../models/teammate.js');

describe('Teammate Controller', () => {
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    vi.clearAllMocks();
  });

  describe('createTeammate', () => {
    it('should create a new teammate successfully', async () => {
      const mockTeammate = {
        id: 1,
        name: 'Lesego Rabanye',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      vi.mocked(Teammate.create).mockResolvedValue(mockTeammate as any);

      const req = {
        body: { teammate: { name: 'Lesego Rabanye' } },
        user: { id: 'user-f3a9c7d2' }
      } as AuthRequest;

      await teammateController.createTeammate(req, mockRes as Response);

      expect(Teammate.create).toHaveBeenCalledWith({ name: 'Lesego Rabanye' });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          teammate: {
            id: 1,
            name: 'Lesego Rabanye'
          }
        }
      });
    });

    it('should handle errors during teammate creation', async () => {
      vi.mocked(Teammate.create).mockRejectedValue(new Error('Database error'));

      const req = {
        body: { teammate: { name: 'Johny Bravo' } },
        user: { id: 'user123' }
      } as AuthRequest;

      await teammateController.createTeammate(req, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'CREATE_TEAMMATE_ERROR',
          details: { message: 'Database error' }
        }
      });
    });
  });

  describe('getAllTeammates', () => {
    it('should return all teammates', async () => {
      const mockTeammates = [
        { id: 1, name: 'Nomsa Dlamini' },
        { id: 2, name: 'Kagiso Maluleke' }
      ];

      vi.mocked(Teammate.findAll).mockResolvedValue(mockTeammates as any);

      const req = {
        query: {},
        user: { id: 'user123' }
      } as unknown as AuthRequest;

      await teammateController.getAllTeammates(req, mockRes as Response);

      expect(Teammate.findAll).toHaveBeenCalledWith({
        order: [['name', 'ASC']]
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          teammates: [
            { id: 1, name: 'Nomsa Dlamini' },
            { id: 2, name: 'Kagiso Maluleke' }
          ]
        }
      });
    });
  });
});
