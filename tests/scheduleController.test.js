import { ScheduleController } from '../../src/controller/ScheduleController';

describe('ScheduleController', () => {
  it('should create a schedule successfully', async () => {
    const mockRequest = {
      body: { date: '2024-12-01', time: '10:00', patientId: 1 },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ScheduleController.create(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      date: '2024-12-01',
      time: '10:00',
      patientId: 1,
    }));
  });
});
