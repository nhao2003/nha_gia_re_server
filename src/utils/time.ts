import HTTP_STATUS from "~/constants/httpStatus";
import { AppError } from "~/models/Error";

export function parseTimeToMilliseconds(timeString: string): number {
  const match = timeString.match(/^(\d+)([smhdMy])$/i);

  if (!match) {
    throw new Error("Invalid time string");
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  // Chuyển đổi thành miliseconds dựa vào đơn vị
  switch (unit) {
    case "s":
      return value * 1000; // Giây
    case "m":
      return value * 60 * 1000; // Phút
    case "h":
      return value * 60 * 60 * 1000; // Giờ
    case "d":
      return value * 24 * 60 * 60 * 1000; // Ngày
    case "mo":
      return value * 30 * 24 * 60 * 60 * 1000; // Tháng (ước tính)
    case "y":
      return value * 365 * 24 * 60 * 60 * 1000; // Năm (ước tính)
    default:
      throw new AppError("Invalid time unit", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
