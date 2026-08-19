import { config } from './config.js';
export class TimeTracker {
    constructor() {
        this.t = window.TrelloPowerUp.iframe()
        //DOM Nodes
        this.timeRecordingsList = null;
        this.buttonAdd = null;
        this.buttonsPlay = null;
        this.buttonsStop = null;
        this.buttonsEdit = null;
        this.buttonsRemove = null;
        //Data
        this.boardMembers = null;
        this.member = null;
        this.activeTimeRecording = {
            id: null,
            time: null,
            memberId: null,
            descriptionId: null
        }
        this.descriptions = config.descriptions;

        this.timer = null;
    }

    async init(){
        this.member = await this.t.member('id');

        this.timeRecordingsList = document.querySelector('[data-list]');
        this.buttonsPlay = document.querySelectorAll('[data-play]');
        this.buttonsStop = document.querySelectorAll('[data-stop]');
        this.buttonsEdit = document.querySelectorAll('[data-edit]');

        await this.renderTimeRecordingsList();
        this.initAddButton();
    }

    initAddButton() {
        const that = this;

        this.buttonAdd = document.querySelector('[data-add]');

        this.buttonAdd.addEventListener('click', (e) => {
            return this.t.popup({
                title: 'Beschreibung wählen',
                items: [
                    {
                        text: 'Management',
                        callback: async function (t, opts) {
                            await that.saveActiveTimeRecording();
                            await that.addEmptyTimeRecordingWithDescriptionId(1);
                            t.closePopup();
                        }
                    },
                    {
                        text: 'Musikproduktion',
                        callback: async function (t, opts) {
                            await that.saveActiveTimeRecording();
                            await that.addEmptyTimeRecordingWithDescriptionId(2);
                            t.closePopup();
                        }
                    },
                    {
                        text: 'Visualproduktion',
                        callback: async function (t, opts) {
                            await that.saveActiveTimeRecording();
                            await that.addEmptyTimeRecordingWithDescriptionId(3);
                            t.closePopup();
                        }
                    },
                    {
                        text: 'Sonstige',
                        callback: async function (t, opts) {
                            await that.saveActiveTimeRecording();
                            await that.addEmptyTimeRecordingWithDescriptionId(4);
                            t.closePopup();
                        }
                    }
                ],
                mouseEvent: e
            });
        });
    }
    initRemoveButtons() {
        const that = this;

        this.buttonsRemove = document.querySelectorAll('[data-remove]');

        this.buttonsRemove.forEach((button) => {
            button.addEventListener('click', (e) => {
                return this.t.popup({
                    type: 'confirm',
                    title: 'Eintrag löschen?',
                    message: 'Bist du sicher, dass du diesen Eintrag löschen möchtest? Das kann nicht rückgängig gemacht werden.',
                    confirmText: 'Ja, löschen',
                    confirmStyle: 'danger',
                    cancelText: 'Abbrechen',
                    onConfirm: function(t, opts) {
                        that.removeTimeRecording(button.parentElement.parentElement.getAttribute('data-id'));
                        that.stopTimer();
                        t.closePopup();
                    },
                    onCancel: function(t, opts) {
                        t.closePopup();
                    },
                    mouseEvent: e
                });
            });
        });
    }

    initStopButtons() {
        this.buttonsStop = this.timeRecordingsList.querySelectorAll('[data-stop]');

        this.buttonsStop.forEach((button) => {
            button.addEventListener('click', async (e) => {
                await this.stopTimer();
                await this.saveActiveTimeRecording();
                await this.initTotalTime();
            });
        });
    }

    initPlayButtons() {
        this.buttonsPlay = this.timeRecordingsList.querySelectorAll('[data-play]');

        this.buttonsPlay.forEach((button) => {
            const timeRecordingId = button.parentElement.parentElement.getAttribute('data-id');

            button.addEventListener('click', async (e) => {
                await this.saveActiveTimeRecording();
                await this.stopTimer();
                await this.startTimerOnTimeRecording(await this.getTimeRecordingById(timeRecordingId));
            });
        });
    }

    initEditButtons() {
        this.buttonsEdit = this.timeRecordingsList.querySelectorAll('[data-edit]');

        this.buttonsEdit.forEach((button) => {
            const timeRecordingId = button.parentElement.parentElement.getAttribute('data-id');
            button.addEventListener('click', async (e) => {
                const that = this;
                this.t.popup({
                    callback: () => {
                        that.renderTimeRecordingsList();
                    },
                    title: 'Werte bearbeiten',
                    url: 'timetracker-edit-popup.html?id=' + timeRecordingId,
                    height: 220,
                    mouseEvent: e
                });
            });
        });
    }

    async getTimeRecordingById(id) {
        const timeRecordings = await this.getAllTimeRecordings();
        return timeRecordings.find(timeRecording => timeRecording.id === id);
    }

    async renderTimeRecordingsList(timeRecordings = null) {
        if (timeRecordings=== null) {
            timeRecordings = await this.getAllTimeRecordings();
        }

        while (this.timeRecordingsList.firstChild) {
            this.timeRecordingsList.removeChild(this.timeRecordingsList.firstChild);
        }

        if (timeRecordings.length === 0) {
            const emptyText = document.createElement('p');
            emptyText.classList.add('empty-notice')
            emptyText.textContent = 'Drücke oben rechts auf das +-Symbol, um einen neuen Eintrag hinzuzufügen.';
            this.timeRecordingsList.appendChild(emptyText);
        } else {
            for (const timeRecording of timeRecordings) {
                await this.renderTimeRecordingItem(timeRecording);
            }
        }

        this.initRemoveButtons();
        this.initStopButtons();
        this.initPlayButtons();
        this.initEditButtons();
        await this.initTotalTime();
    }
    async initTotalTime() {
        this.totalTime = document.querySelector('[data-total-time]');
        this.totalTime.innerHTML = await this.getTotalTime();
    }
    async getTotalTime() {
        const timeRecordings = await this.getAllTimeRecordings();
        const totalSeconds = timeRecordings.reduce((total, item) => total + this.timeStringToSeconds(item.time), 0);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const hh = String(totalHours).padStart(2, '0');
        const mm = String(totalMinutes % 60).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    }

    timeStringToSeconds(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }
    async renderTimeRecordingItem(timeRecording) {
        const template = document.createElement('template');
        const member = await this.getMemberbyMemberId(timeRecording.memberId);

        template.innerHTML = `
            <li data-id="${timeRecording.id}">
                <div class="content-wrapper">
                    <span data-time="" class="time">${timeRecording.time}</span>
                    <img type="text" class="member" src="${member.avatar}"/>
                    <span type="text" class="description">${this.descriptions[timeRecording.descriptionId]}</span>
                </div>
                <div class="button-wrapper">
                    <button data-play="" class="icon play" title="Zeitenbuchung starten"></button>
                    <button data-stop="" class="icon stop" title="Zeitbuchung abschliessen"></button>
                    <button data-edit="" class="icon edit" title="Zeitbuchung bearbeiten"></button>
                    <button data-remove="" class="icon remove" title="Zeitbuchung löschen"></button>
                </div>
            </li>
        `;

        const timeRecordingItem = template.content.firstElementChild;

        this.timeRecordingsList.appendChild(timeRecordingItem);
    }
    async getAllTimeRecordings() {
        let timeRecordings = await this.t.get('card', 'shared', 'timeRecordings');

        if (typeof timeRecordings === 'undefined') {
            timeRecordings = [];
            await this.t.set('card', 'shared', 'timeRecordings', timeRecordings);
        }

        return timeRecordings;
    }
    async addEmptyTimeRecordingWithDescriptionId(descriptionId) {
        const timeRecording = {
            time: "00:00:00",
            memberId: this.member.id,
            descriptionId: descriptionId
        }

        await this.addTimeRecoding(timeRecording);
    }
    async removeTimeRecording(timeRecordingId) {
        let timeRecordings = await this.getAllTimeRecordings()

        timeRecordings = timeRecordings.filter(timeRecording => timeRecording.id !== timeRecordingId);
        await this.t.set('card', 'shared', 'timeRecordings', timeRecordings);
        await this.renderTimeRecordingsList(timeRecordings);
    }
    async addTimeRecoding(timeRecording) {
        let timeRecordings = await this.getAllTimeRecordings()
        const hashAsId = btoa(Date.now().toString() + this.member.id.toString());

        timeRecording.id = hashAsId;
        timeRecordings.push(timeRecording);
        await this.t.set('card', 'shared', 'timeRecordings', timeRecordings);
        await this.renderTimeRecordingsList(timeRecordings);
        await this.startTimerOnTimeRecording(timeRecording);
    }
    async startTimerOnTimeRecording(timerecording) {
        await this.stopTimer();
        this.enableUnloadWarning();
        this.activeTimeRecording = timerecording;
        const timeNode = this.timeRecordingsList.querySelector(`[data-id="${timerecording.id}"] [data-time]`);
        let [hours, minutes, seconds] = timerecording.time.split(':').map(Number);

        this.removeActiveTrackingClass();

        timeNode.parentElement.parentElement.classList.add('is-tracking');

        this.timer = setInterval(() => {
            seconds++;
            if (seconds >= 60) {
                seconds = 0;
                minutes++;
            }

            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }

            const hh = String(hours).padStart(2, '0');
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            const time = `${hh}:${mm}:${ss}`;
            timeNode.textContent = time;
            this.activeTimeRecording.time = time;
            if (seconds % 60 === 0) {
                this.saveActiveTimeRecording();
            }
        }, 1000);
    }
    async stopTimer() {
        this.disableUnloadWarning();
        clearInterval(this.timer);
        this.timer = null;
        this.removeActiveTrackingClass();
    }
    async saveActiveTimeRecording() {
        const timeRecordings = await this.getAllTimeRecordings();
        const index = timeRecordings.findIndex(timeRecording => timeRecording.id === this.activeTimeRecording.id);

        if (index !== -1) {
            timeRecordings[index] = this.activeTimeRecording;
            await this.t.set('card', 'shared', 'timeRecordings', timeRecordings);
        }
    }
    removeActiveTrackingClass() {
        const previousTimeNode = this.timeRecordingsList.querySelector(`.is-tracking`);

        if (previousTimeNode !== null) {
            previousTimeNode.classList.remove('is-tracking');
        }
    }
    enableUnloadWarning() {
        window.addEventListener('beforeunload', this.handleBeforeUnload);
    }

    disableUnloadWarning() {
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }
    handleBeforeUnload(e) {
        e.preventDefault();
        e.returnValue = '';
    }
    async initBoardMembers() {
        const boardMembers = await this.t.board('members');

        this.boardMembers = boardMembers.members;
    }
    async getMemberbyMemberId(memberId) {
        if (this.boardMembers === null) {
            await this.initBoardMembers();
        }

        return this.boardMembers.find(member => member.id === memberId);
    }
}

new TimeTracker().init();