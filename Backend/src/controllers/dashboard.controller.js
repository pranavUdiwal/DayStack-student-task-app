const Journal = require('../models/journal.model');

const getDashboardData = async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user._id });
        
        const totalEntries = journals.length;
        
        let totalDuration = 0;
        journals.forEach(journal => {
            totalDuration += journal.duration || 0;
        });

        const averageDuration = totalEntries > 0 ? totalDuration / totalEntries : 0;

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        let currentWeekDuration = 0;
        let previousWeekDuration = 0;

        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const weeklyProgressMap = {
            MON: 0,
            TUE: 0,
            WED: 0,
            THU: 0,
            FRI: 0,
            SAT: 0,
            SUN: 0
        };

        journals.forEach(journal => {
            const date = new Date(journal.createdAt);
            const duration = journal.duration || 0;
            
            if (date >= sevenDaysAgo) {
                currentWeekDuration += duration;
                const dayStr = dayNames[date.getDay()];
                if (weeklyProgressMap[dayStr] !== undefined) {
                    weeklyProgressMap[dayStr] += duration;
                }
            } else if (date >= fourteenDaysAgo && date < sevenDaysAgo) {
                previousWeekDuration += duration;
            }
        });

        const weeklyProgress = [
            { day: 'MON', durationMinutes: weeklyProgressMap.MON },
            { day: 'TUE', durationMinutes: weeklyProgressMap.TUE },
            { day: 'WED', durationMinutes: weeklyProgressMap.WED },
            { day: 'THU', durationMinutes: weeklyProgressMap.THU },
            { day: 'FRI', durationMinutes: weeklyProgressMap.FRI },
            { day: 'SAT', durationMinutes: weeklyProgressMap.SAT },
            { day: 'SUN', durationMinutes: weeklyProgressMap.SUN }
        ];

        let comparisonVsLastWeek = 0;
        if (previousWeekDuration > 0) {
            comparisonVsLastWeek = Math.round(((currentWeekDuration - previousWeekDuration) / previousWeekDuration) * 100);
        } else if (currentWeekDuration > 0) {
            comparisonVsLastWeek = 100;
        }

        res.status(200).json({
            totalEntries,
            totalStudyHours: totalDuration,
            weeklyProgress,
            comparisonVsLastWeek,
            currentWeekDuration,
            productivityOverview: {
                averageDurationPerEntry: Math.round(averageDuration * 100) / 100
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

module.exports = {
    getDashboardData
};
