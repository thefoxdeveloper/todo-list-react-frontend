import { Trash, Check } from 'phosphor-react';

import styles from './Task.module.css';
import { useState } from 'react';

interface TaskProps {
  id: string;
  taskTitle: string;
  isComplete: boolean;
  onCheckTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string) => void
}

export function Task({id, taskTitle, isComplete, onCheckTask, onDeleteTask, onEditTask} : TaskProps) {

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(taskTitle);

  function handleCheckTask(){
    onCheckTask(id)
  }

  function handleDeleteTask(){
    onDeleteTask(id)
  }
  
  function handleEditTask() {
    setEditing(true);
  }

  function handleSaveTask() {
    onEditTask(id, newTitle);
    setEditing(false);
  }

  return (
    <li className='task'>
      <div className={styles.checkboxContainer}>
        <label 
          className={isComplete ? styles.checkboxTaskChecked : styles.checkboxTask}
          onClick={handleCheckTask}
          >
          <span className={isComplete ? styles.checkmarkChecked : styles.checkmark }><Check size={14}/></span>
        </label>
      </div>

      {editing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className={styles.editTask}
        />
      ) : (
        <div 
          className={isComplete ? styles.taskTitleChecked : styles.taskTitle }
          onClick={handleEditTask}
        >
          <p>{taskTitle}</p>
                 </div>
      )}

      {editing && (
        <button 
          className={styles.save}
          type='button'
          onClick={handleSaveTask}
        >
          Save
        </button>
      )}

      <button 
        className={styles.deleteTask}
        type='button'
        onClick={handleDeleteTask}
      >
        <Trash size={24}/>
      </button>
    </li>
  )
}