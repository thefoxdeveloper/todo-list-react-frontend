import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import styles from './TasksList.module.css';

import empty from '../assets/emptyList.svg';
import addButton from '../assets/plus.svg';
import { Task } from './Task';

interface Tasks {
  id: string;
  task_title: string;
  is_complete: boolean;
}

export function TasksList() {
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [taskName, setTaskName] = useState('');
  const [tasksCompleted, setTasksCompleted] = useState(0);

  const isInputEmpty = taskName.trim().length === 0;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/tasks')
      .then(response => {
        setTasks(response.data);
       
        
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const tasksDone = tasks.reduce((acc, { is_complete }) => {
      return is_complete ? acc + 1 : acc;
    }, 0);

    setTasksCompleted(tasksDone);
  }, [tasks]);

  function handleCreateNewTask(e: FormEvent) {
    e.preventDefault();

    if (!isInputEmpty) {
      const newTask = {
        id: uuidv4(),
        taskTitle: taskName,
        isComplete: false,
      };

      axios.post('http://127.0.0.1:8000/api/tasks', newTask)
        .then(response => {
          setTasks([response.data, ...tasks]);
          setTaskName('');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  function handleOnChangeInput(e: ChangeEvent<HTMLInputElement>) {
    setTaskName(e.target.value);
  }

  function handleTaskCompleted(id: string) {
    axios.patch(`http://127.0.0.1:8000/api/tasks/${id}`, { isComplete: true })
      .then(response => {
        const updatedTask = response.data;
        const updatedTasks = tasks.map(task => task.id === id ? updatedTask : task);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error(error);
      });
  }
  function updateTaskTitle(id: string, newTitle: string) {
    axios.patch(`http://127.0.0.1:8000/api/tasks/${id}`, { taskTitle: newTitle })
      .then(response => {
        const updatedTask = response.data;
        const updatedTasks = tasks.map(task => task.id === id ? updatedTask : task);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleDeleteTask(id: string) {
    axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <form
          className={styles.createTaskField}
          onSubmit={handleCreateNewTask}
        >
          <input
            type="text"
            placeholder="Adicione uma nova tarefa"
            name="taskName"
            onChange={handleOnChangeInput}
            value={taskName}
          />

          <button type="submit">
            Criar
            <img src={addButton} alt="Adicionar tarefa" />
          </button>
        </form>

        <div className={styles.tasksInfo}>
          <div className={styles.createdTasks}>
            <span className={styles.createdTasksTitle}>Tarefas criadas</span>
            <span className={styles.createdTasksAmount}>{tasks.length}</span>
          </div>

          <div className={styles.doneTasks}>
            <span className={styles.doneTasksTitle}>Concluídas</span>
            <span className={styles.doneTasksAmount}>
              {tasksCompleted} de {tasks.length}
            </span>
          </div>
        </div>

        {tasks.length ? (
          <section>
            {tasks.map(({ id, task_title, is_complete }) => (
              <ul key={id}>
                <Task
                  id={id}
                  taskTitle={task_title}
                  isComplete={is_complete}
                  onCheckTask={handleTaskCompleted}
                  onDeleteTask={handleDeleteTask}
                  onEditTask={updateTaskTitle}
                />
              </ul>
            ))}
          </section>
        ) : (
          <section className={styles.tasksEmpty}>
            <img src={empty} alt="todo vazio" />
            <strong>Você ainda não tem tarefas cadastradas</strong>
            <p>Crie tarefas e organize seus itens a fazer</p>
          </section>
        )}
      </main>
    </div>
  );
}