import { Earning } from "../models/earning.model";

const getDailyEarnings = async (captainId, date = new Date()) => {
  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const earnings = await Earning.aggregate([
    {
      $match: {
        captain: mongoose.Types.ObjectId(captainId),
        date: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return earnings[0]?.total || 0;
};
const getWeeklyEarnings = async (captainId, weekStart = new Date()) => {
  const startOfWeek = new Date(
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const earnings = await Earning.aggregate([
    {
      $match: {
        captain: mongoose.Types.ObjectId(captainId),
        date: { $gte: startOfWeek, $lte: endOfWeek },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return earnings[0]?.total || 0;
};
const getMonthlyEarnings = async (
  captainId,
  month = new Date().getMonth(),
  year = new Date().getFullYear()
) => {
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const earnings = await Earning.aggregate([
    {
      $match: {
        captain: mongoose.Types.ObjectId(captainId),
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return earnings[0]?.total || 0;
};
const getLifetimeEarnings = async (captainId) => {
  const earnings = await Earning.aggregate([
    { $match: { captain: mongoose.Types.ObjectId(captainId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return earnings[0]?.total || 0;
};

export {
  getDailyEarnings,
  getWeeklyEarnings,
  getMonthlyEarnings,
  getLifetimeEarnings,
};
