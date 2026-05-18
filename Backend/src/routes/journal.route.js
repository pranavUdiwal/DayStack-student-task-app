const express = require('express');
const {
    createJournal,
    getJournals,
    getJournalById,
    updateJournal,
    deleteJournal
} = require('../controllers/journal.controller');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', auth, createJournal);          
router.get('/', auth, getJournals);            
router.get('/:id', auth, getJournalById);      
router.put('/:id', auth, updateJournal);        
router.delete('/:id', auth, deleteJournal);    

module.exports = router;