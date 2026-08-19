import { config } from './config.js';

class TimeTrackerEditPopup {
    constructor() {
        this.time = null;
        this.member = null;
        this.description = null;
        this.boardMembers = null;
    }
    async init() {
        this.t = window.TrelloPowerUp.iframe();

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            throw new Error('id parameter is missing');
        }
        this.id = id;
        this.timeRecording = await this.getTimeRecordingById(id);
        this.time = document.querySelector('[data-time]');
        this.member = document.querySelector('[data-member]');
        this.description = document.querySelector('[data-description]');
        this.descriptions = config.descriptions;
        this.initDescriptionSelect();
        await this.initMemberSelect();
        this.initTimeInput();
        this.initAbortButton();
        this.initSubmitButton();
    }
    initSubmitButton() {
        document.querySelector('[data-submit]').addEventListener('click', async () => {
            await this.saveActiveTimeRecording();
            this.t.notifyParent('done');
            this.t.closePopup();
        });
    }
    initAbortButton() {
        document.querySelector('[data-abort]').addEventListener('click', () => {
            this.t.closePopup();
        });
    }
    initTimeInput() {
        this.time.value = this.timeRecording.time;
    }
    initDescriptionSelect() {
        Object.entries(this.descriptions).forEach(([id, description]) => {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = description;
            if (parseInt(id) === parseInt(this.timeRecording.descriptionId)) {
                option.selected = 'selected';
            }
            this.description.appendChild(option);
        });
    }
    async initMemberSelect() {
        await this.initBoardMembers();

        this.boardMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.fullName;
            if (member.id === this.timeRecording.memberId) {
                option.selected = 'selected';
            }
            this.member.appendChild(option);
        });
    }
    async initBoardMembers() {
        const boardMembers = await this.t.board('members');

        this.boardMembers = boardMembers.members;
    }
    async getTimeRecordingById(id) {
        const timeRecordings = await this.getAllTimeRecordings();
        return timeRecordings.find(timeRecording => timeRecording.id === id);
    }
    async getAllTimeRecordings() {
        return await this.t.get('card', 'shared', 'timeRecordings');
    }
    async saveActiveTimeRecording() {
        const timeRecordings = await this.getAllTimeRecordings();
        const time = this.time.value;
        const memberId = this.member.value;
        const descriptionId = this.description.value;
        this.activeTimeRecording = {
            id: this.id,
            time,
            memberId,
            descriptionId
        };
        const index = timeRecordings.findIndex(timeRecording => timeRecording.id === this.activeTimeRecording.id);

        if (index !== -1) {
            timeRecordings[index] = this.activeTimeRecording;
            await this.t.set('card', 'shared', 'timeRecordings', timeRecordings);
        }
    }
}

new TimeTrackerEditPopup().init();