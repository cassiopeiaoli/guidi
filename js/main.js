const eHighString = document.querySelector('#E');
const bString = document.querySelector('#B');
const gString = document.querySelector('#G');
const dString = document.querySelector('#D');
const aString = document.querySelector('#A');
const eLowString = document.querySelector('#Elow');
const midiLoader = document.querySelector('.midi-loader');
const select = document.querySelector('.select');
let tracks = {};

let markerX = 0;
let lastX = 0;

// Each 0-index means flat note
const GUITAR_STRINGS = [
    ['E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4', 'C5', 'Db5', 'D5', 'Eb5', 'E5'],
    ['B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4'],
    ['G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4'],
    ['D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3', 'C4', 'Db4', 'D4'],
    ['A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3'],
    ['E2', 'F2', 'Gb2', 'G2' ,'Ab2', 'A2', 'Bb2', 'B2', 'C3', 'Db3', 'D3', 'Eb3', 'E3']
];

midiLoader.addEventListener('change', (e) => loadFile(e), false);

function loadFile(e) {
    const file = e.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const content = e.target.result; 
        setData(content);
    };

    reader.readAsArrayBuffer(file);
}

function setData(incomingData) {
    document.querySelectorAll('.note').forEach(note => note.remove());
    document.querySelectorAll('.string').forEach(string => string.style.width = '0px');
    select.innerHTML = '';
    tracks = {};
    const data = incomingData;
    loadMidi(data);
}

function addOption(name) {
    const option = document.createElement('option');
    option.textContent = name;
    option.value = name;
    select.appendChild(option);
}

function reloadTab(newTab) {
    document.querySelectorAll('.note').forEach(note => note.remove());
    document.querySelectorAll('.string').forEach(string => string.style.width = '0px');

    if (!tracks[newTab]) {
        return;
    }

    tracks[newTab].forEach(([note, time]) => {
        const noteData = getNoteAndStringIndex(note);
        renderNote(noteData[0], time, noteData[1]);            
    });

    document.querySelectorAll('.string').forEach(string => {
        string.style.width = (lastX * 2) + 'px';
    });

    document.querySelectorAll('.note').forEach(note => note.style.opacity = '1');

    document.querySelectorAll('.note').forEach(note => note.style.opacity = '1');
    const firstNote = document.querySelector('.note');
    firstNote.scrollIntoView({ behavior: 'smooth' });
}

function loadMidi(data) {
    const midiData = new Midi(data);

    midiData.tracks.forEach(({ name, notes }, index) => {
        if (notes.length === 0) {
            return;
        }
        if (name === "") {
            name = 'Unknown-'+index; 
        }
        addOption(name);
        tracks[name] = notes.map(note => [note.name, Number.parseFloat((note.time).toFixed(1))]);
    });

    Object.values(tracks)[0].forEach(([note, time]) => {
        const noteData = getNoteAndStringIndex(note);
        renderNote(noteData[0], time, noteData[1]);            
    });

    document.querySelectorAll('.string').forEach(string => {
        string.style.width = (lastX * 2) + 'px';
    });

    eHighString.style.opacity = '1';
    eLowString.style.opacity = '1';
    dString.style.opacity = '1';
    bString.style.opacity = '1';
    aString.style.opacity = '1';
    gString.style.opacity = '1';

    document.querySelectorAll('.note').forEach(note => note.style.opacity = '1');
    const firstNote = document.querySelector('.note');
    firstNote.scrollIntoView({ behavior: 'smooth' });
}

function getStringYPosition(stringNode) {
    return stringNode.getBoundingClientRect().y;
}

function getNoteAndStringIndex(note) {
    const results = [];

    for (let i = 0; i < GUITAR_STRINGS.length; i++) {
        for (let j = 0; j < GUITAR_STRINGS[i].length; j++) {
            if (GUITAR_STRINGS[i][j] === note) {
                results[0] = j;
                break;
            }
        }

        if (results[0]) {
            results[1] = i;
            break;
        }
    }

    return results;
}

function stringIdToNote(string = 0) {
    switch (string) {
        case 0:
            return eHighString;
        case 1:
            return bString;
        case 2:
            return gString;
        case 3:
            return dString;
        case 4:
            return aString;
        case 5:
            return eLowString;
        default:
            throw new Error("Nuh uh");
    }
}

function renderNote(noteNumber = null, timeDuration, string = 0) {
    const stringNode = this.stringIdToNote(string);
    const stringY = this.getStringYPosition(stringNode);
    const span = document.createElement('span');
    span.className = 'note';
    span.textContent = noteNumber;
    span.style.top = stringY - 9 + 'px';
    span.style.left = 10 + timeDuration * 250 + 'px';
    document.querySelector('.notes').appendChild(span);
    lastX = (10 + timeDuration * 250);
}

select.addEventListener('change', () => reloadTab(select.value));