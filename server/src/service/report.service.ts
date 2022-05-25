import FlightModel from '@/model/flight.model';
import { MonthReportModel, YearReportModel } from '@/model/report.model';
import dayjs from 'dayjs';
import _ from 'lodash/fp';

async function getLastestMonthReportItems(time: Date) {
  const month = dayjs(time).month() + 1;
  const year = dayjs(time).year();

  const monthReportItems = await FlightModel.aggregate()
    .match({
      $expr: {
        $and: [
          {
            $eq: [{ $month: '$departureTime' }, month],
          },
          {
            $eq: [{ $year: '$departureTime' }, year],
          },
        ],
      },
    })
    .unwind('$tickets')
    .match({
      'tickets.paid': true,
    })
    .group({
      _id: {
        flightId: '$_id',
      },
      ticketSelledAmount: { $sum: 1 },
      revenue: { $sum: '$tickets.price' },
    })
    .project({
      _id: 0,
      flightId: '$_id.flightId',
      ticketSelledAmount: '$ticketSelledAmount',
      revenue: '$revenue',
    })
    .sort({
      revenue: -1,
    });

  const totalRevenue = monthReportItems.reduce((total, item) => total + item.revenue, 0);

  return monthReportItems.map((item) => {
    item.rate = item.revenue / totalRevenue;

    return item;
  });
}

async function getLastestYearReportItems(time: Date) {
  const year = dayjs(time).year();

  const yearReportItems = await FlightModel.aggregate()
    .match({
      $expr: {
        $and: [
          {
            $eq: [{ $year: '$departureTime' }, year],
          },
        ],
      },
    })
    .addFields({
      revenue: {
        $reduce: {
          input: '$tickets',
          initialValue: 0,
          in: {
            $add: [
              '$$value',
              {
                $cond: [{ $eq: ['$$this.paid', true] }, '$$this.price', 0],
              },
            ],
          },
        },
      },
    })
    .group({
      _id: {
        $month: '$departureTime',
      },
      revenue: { $sum: '$revenue' },
      flightAmount: { $sum: 1 },
    })
    .project({
      _id: 0,
      month: '$_id',
      revenue: '$revenue',
      flightAmount: '$flightAmount',
    });

  let totalRevenue = 0;
  for (let i = 1; i <= 12; i++) {
    const idx = yearReportItems.findIndex((item) => item.month === i);
    if (idx === -1) {
      yearReportItems.push({
        month: i,
        revenue: 0,
        flightAmount: 0,
      });
    } else {
      totalRevenue += yearReportItems[idx].revenue;
    }
  }

  return yearReportItems
    .map((item) => _.set('rate', item.revenue / totalRevenue, item))
    .sort((a, b) => a.month - b.month);
}

export async function createYearReport(time: Date) {
  const items = await getLastestYearReportItems(time);

  return YearReportModel.create({
    time,
    items,
  });
}

export async function createMonthReport(time: Date) {
  const items = await getLastestMonthReportItems(time);

  return MonthReportModel.create({
    time,
    items,
  });
}

export async function isExistMonthReport(time: Date) {
  const month = dayjs(time).month() + 1;
  const year = dayjs(time).year();

  return MonthReportModel.exists({
    $expr: {
      $and: [
        {
          $eq: [{ $month: '$time' }, month],
        },
        {
          $eq: [{ $year: '$time' }, year],
        },
      ],
    },
  });
}

export async function isExistYearReport(time: Date) {
  const year = dayjs(time).year();

  return YearReportModel.exists({
    $eq: [{ $year: '$time' }, year],
  });
}

export async function updateMonthReport(reportId: string) {
  const report = await MonthReportModel.findById(reportId).orFail();

  report.items = await getLastestMonthReportItems(report.time);

  return report.save();
}

export async function updateYearReport(reportId: string) {
  const report = await YearReportModel.findById(reportId).orFail();

  report.items = await getLastestYearReportItems(report.time);

  return report.save();
}

export async function deleteYearReport(reportId: string) {
  return YearReportModel.findByIdAndDelete(reportId);
}

export async function deleteMonthReport(reportId: string) {
  return MonthReportModel.findByIdAndDelete(reportId);
}
