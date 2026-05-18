const Journal = require('../models/journal.model');

const createJournal = async (req, res) => {
    try {
        const { title, content, duration, difficulty } = req.body;
        const journal = await Journal.create({
            user: req.user._id,
            title,
            content,
            duration,
            difficulty
        });
        res.status(201).json(journal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const getJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.user._id }).sort({ _id: -1 });
        const formattedJournals = journals.map(j => {
            const doc = j.toObject();
            if (!doc.createdAt && j._id) {
                doc.createdAt = j._id.getTimestamp();
            }
            return doc;
        });
        res.status(200).json(formattedJournals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const getJournalById = async (req, res) => {
    try {
        const journal = await Journal.findOne({
            _id: req.params.id,
            user: req.user._id
        });
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }
        const doc = journal.toObject();
        if (!doc.createdAt && journal._id) {
            doc.createdAt = journal._id.getTimestamp();
        }
        res.status(200).json(doc);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const updateJournal = async (req, res) => {
    try {
        const { title, content, duration, difficulty } = req.body;
        const journal = await Journal.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { title, content, duration, difficulty },
            { new: true }
        );
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }
        res.status(200).json(journal);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }
        res.status(200).json({ message: 'Journal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
        console.log(error.message);
    }
};

module.exports = {
    createJournal,
    getJournals,
    getJournalById,
    updateJournal,
    deleteJournal
};
