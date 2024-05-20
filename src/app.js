"use strict";

class View {
    constructor(viewId) {
        this.viewContent = document.querySelector(viewId);
    }

    connectEvent(event, callback) {
        this.viewContent.addEventListener(event, callback);
    }
}

class TemplatedView extends View {
    constructor(viewId, templateId) {
        super(viewId);
        this.template = new Template(templateId, this.fillItemCb.bind(this));
    }

    update(data) {
        this.viewContent.textContent = "";
        const content = this.template.fillCollection(data);
        this.viewContent.appendChild(content);
    }
}

class TaskView extends TemplatedView {
    constructor(viewId, templateId) {
        super(viewId, templateId);
    }

    fillItemCb(taskText, target, index) {
        target.querySelector(".title.icon").textContent = taskText;
        target.querySelector(".task").dataset.index = index;
    }
}

class Task {
    constructor(taskView) {
        this.taskView = taskView;
        this.tasks = [];
        this.taskInput = document.querySelector('.text');
        this.addTaskButton = document.querySelector('.add');
        this.task = document.querySelector('.task');

        this.addTaskButton.addEventListener('click', this.addTask.bind(this));
        taskView.connectEvent("click", this.removeTask.bind(this));
        taskView.connectEvent("click", this.doneTask.bind(this));
        this.taskInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                this.addTask();
            }
        });


        this.readTasks();
    }

    readTasks() {
        this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        this.taskView.update(this.tasks);
    }

    updateTasks() {
        this.taskView.update(this.tasks);
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    getEventIndex(event) {
        return event.target.parentElement.dataset?.index;
    }

    addTask() {
        
        const taskText = this.taskInput.value;

        if (taskText === "") {
        throw new Error("Introduceți un task!");
        }

        if (taskText) {
            this.tasks.push(taskText);
            this.updateTasks();
            this.taskInput.value = "";
        }
    }

    removeTask(event) {
        if (!event.target.classList.contains("delete")) {
            return;
        }

        const index = this.getEventIndex(event);
        if (!index) {
            return;
        }

        this.tasks.splice(index, 1);

        this.updateTasks();
    }

    doneTask(event) {
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            taskElement.classList.toggle("done");
        }
    }

}

const taskView = new TaskView('.task-list', '#template');
const taskController = new Task(taskView);
