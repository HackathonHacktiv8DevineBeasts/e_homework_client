import axios from 'axios';
const baseUrl = 'https://ehomework-server.herokuapp.com'

export const ADD_TASK = 'ADD_TASK';
export const FETCH_TASKS = 'FETCH_TASKS';
export const EDIT_TASK = 'EDIT_TASK';

//Login
export const TEACHER_LOGIN = 'TEACHER_LOGIN';

export function teacherLogin(email, passowrd) {
  return (dispatch) => {
    return new Promise((resolve, _) => {
      axios({
        method: 'post',
        url: baseUrl + '/login',
        data: {
          email,
          passowrd
        }
      })
        .then(({ data }) => {
          console.log("Get token", data)
          localStorage.setItem('token', data.token);
          dispatch({ type: TEACHER_LOGIN, payload: {email, passowrd} });
          return resolve("Success");
        })
        .catch(console.log);
    })
  }
}

//Task
export function addTask(task) {
  return (dispatch) => {
    axios({
      method: 'post',
      url: baseUrl + '/task',
      data: { 
        emailStudent: '-', 
        emailTeacher: 'teacher27@mail.com', 
        score: 0, 
        url: '-', 
        viewURL: task.file, 
        status: false, 
        description: task.description, 
        taskName: task.name 
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(({ data }) => {
        console.log("Get tasks", data);
        const groupByName = {};
        const result = data.result;
        for (const index in result) {
          if (groupByName[result[index].taskName]) {
            groupByName[result[index].taskName].students.push(result[index]);
          } else {
            groupByName[result[index].taskName] = {
              name: result[index].taskName,
              description: result[index].description,
              students: [result[index]]
            }
          }
        }
        const newData = Object.values(groupByName);
        console.log("GroupBy", newData);
        return dispatch({ type: ADD_TASK, payload: task });
      })
      .catch(console.log);
  }
}

export function fetchTasks() {
  return (dispatch) => {
    axios({
      method: 'get',
      url: baseUrl + '/task',
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(({ data }) => {
        console.log("Get tasks", data);
        const groupByName = {};
        const result = data.result;
        for (const index in result) {
          if (groupByName[result[index].taskName]) {
            groupByName[result[index].taskName].students.push(result[index]);
          } else {
            groupByName[result[index].taskName] = {
              name: result[index].taskName,
              description: result[index].description,
              file: result[index].viewURL,
              students: [result[index]]
            }
          }
        }
        const newData = Object.values(groupByName);
        console.log("GroupBy", newData);
        return dispatch({ type: FETCH_TASKS, payload: newData});
      })
      .catch(console.log);
  }
}

export function updateTask(student) {
  return (dispatch) => {
    axios({
      method: 'put',
      url: baseUrl + '/task/edit/' + student._id,
      data: { 
        emailStudent: student.emailStudent, 
        emailTeacher: student.emailTeacher , 
        score: student.score, 
        url: student.url, 
        viewURL: student.viewURL, 
        status: student.status, 
        description: student.description, 
        taskName: student.taskName 
      },
      headers: {
        token: localStorage.getItem('token')
      }
    })
      .then(({ data }) => {
        console.log("Update tasks", data);
        return dispatch({ type: EDIT_TASK, payload: data });
      })
      .catch(console.log);
  }
}