import ConcurrentQueue from '../../src/utils/queue';

describe('ConcurrentQueue', () => {
  describe('add', () => {
    it('should execute a single task', async () => {
      const queue = new ConcurrentQueue();
      const task = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(task).toHaveBeenCalled();
    });

    it('should execute multiple tasks concurrently', async () => {
      const queue = new ConcurrentQueue(2);
      const task1 = jest.fn().mockResolvedValue(undefined);
      const task2 = jest.fn().mockResolvedValue(undefined);
      const task3 = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task1 });
      queue.add({ execute: task2 });
      queue.add({ execute: task3 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(task1).toHaveBeenCalled();
      expect(task2).toHaveBeenCalled();
      expect(task3).toHaveBeenCalled();
    });

    it('should execute tasks in the order they were added', async () => {
      const queue = new ConcurrentQueue();
      const task1 = jest.fn().mockResolvedValue(undefined);
      const task2 = jest.fn().mockResolvedValue(undefined);
      const task3 = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task1 });
      queue.add({ execute: task2 });
      queue.add({ execute: task3 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(task1).toHaveBeenCalled();
      expect(task2).toHaveBeenCalled();
      expect(task3).toHaveBeenCalled();
      expect(task1.mock.invocationCallOrder[0]).toBeLessThan(task2.mock.invocationCallOrder[0]);
      expect(task2.mock.invocationCallOrder[0]).toBeLessThan(task3.mock.invocationCallOrder[0]);
    });

    it('should handle errors thrown by tasks', async () => {
      const queue = new ConcurrentQueue();
      const task1 = jest.fn().mockRejectedValue(new Error('Task 1 failed'));
      const task2 = jest.fn().mockResolvedValue(undefined);
      const task3 = jest.fn().mockRejectedValue(new Error('Task 3 failed'));
      const onError1 = jest.fn();
      const onError2 = jest.fn();
      const onError3 = jest.fn();
      queue.add({ execute: task1, onError: onError1 });
      queue.add({ execute: task2, onError: onError2 });
      queue.add({ execute: task3, onError: onError3 });
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(task1).toHaveBeenCalled();
      expect(task2).toHaveBeenCalled();
      expect(task3).toHaveBeenCalled();
      expect(onError1).toHaveBeenCalledWith(new Error('Task 1 failed'));
      expect(onError2).not.toHaveBeenCalled();
      expect(onError3).toHaveBeenCalledWith(new Error('Task 3 failed'));
    });
  });

  describe('clear', () => {
    it('should clear all tasks from the queue', () => {
      const queue = new ConcurrentQueue();
      const task1 = jest.fn().mockResolvedValue(undefined);
      const task2 = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task1 });
      queue.add({ execute: task2 });
      queue.clear();
      expect(queue.length).toEqual(0);
    });
  });

  describe('length', () => {
    it('should return the number of tasks remaining in the queue', () => {
      const queue = new ConcurrentQueue();
      const task1 = jest.fn().mockResolvedValue(undefined);
      const task2 = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task1 });
      queue.add({ execute: task2 });
      expect(task1).toHaveBeenCalled();
      expect(task2).toHaveBeenCalled();

      expect(queue.length).toEqual(2);
    });
  });

  describe('isRunning', () => {
    it('should return true if the queue is currently executing tasks', async () => {
      const queue = new ConcurrentQueue();
      const task = jest.fn().mockResolvedValue(undefined);
      queue.add({ execute: task });
      expect(queue.isRunning).toEqual(true);
      await new Promise((resolve) => setTimeout(resolve, 10));
      expect(queue.isRunning).toEqual(false);
      expect(task).toHaveBeenCalled();
    });

    it('should return false if the queue is not currently executing tasks', () => {
      const queue = new ConcurrentQueue();
      expect(queue.isRunning).toEqual(false);
    });
  });
});
