import { createInterface } from "readline";
import { readFileSync, writeFileSync } from "fs";

import chalk from "chalk";
import { join } from "path";


const tasks = [];
const DB_FILE = "tasks.txt";

//* Interfaz para realizar operaciones de entrada y salida 
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

//? Muestra el menu
function displayMenu() {
  console.log(chalk.yellow.bold("\n🦊🦊🦊🦊🦊 To Do App 🦊🦊🦊🦊🦊"));
  console.log(chalk.blueBright("Menú de Opciones:"));
  console.log("1. Agregar tarea");
  console.log("2. Listar tareas");
  console.log("3. Completar tarea");
  console.log("4. Salir");
}

//? Lee las tareas de un archivo para persistencia 
function loadTasks() {
  try {
    //* Leyendo tareas y devolviendo un string 
    const data = readFileSync(DB_FILE, "utf-8");
    //* Guardando cada línea del string de texto en un arreglo
    const lines = data.split("\n");
    tasks.length = 0;

    lines.forEach(line => {
      if (line.trim() !== "") {
        const [task, completed] = line.split("|");

        tasks.push({ task, completed: completed === "false" ? false : Boolean(completed) });
      }
    });

    console.log(chalk.green.bold("\nLas tareas se han cargado desde la BD"));
  } catch (error) {
    console.log(chalk.green.bold("\nNo hay tareas por hacer"));
  }
}

//? Escribe o modifica una tarea en un archivo para persistencia 
function saveTask() {
  //* Creando listado de tareas para que en un arreglo cada tarea se guarde como un string
  const data = tasks.map(task => `${task.task}|${task.completed}`).join("\n");

  writeFileSync(DB_FILE, data, "utf-8");

  console.log(chalk.green.bold("\nTarea agregada a la BD con éxito"));
}

//? Agrega una tarea 
function addTask() {
  rl.question(chalk.bgMagentaBright("Escribe la tarea: "), (task) => {
    //* Crea la tarea 
    tasks.push({ task, completed: false });
    console.log(chalk.green.bold("\nTarea agregada con éxito"));

    saveTask();
    loadTasks();
    displayMenu();
    chooseOption();
  });
}

//? Lista las tareas
function listTask() {
  console.log(chalk.yellow.bold("\n🦊🦊🦊🦊🦊 Tareas 🦊🦊🦊🦊🦊\n"));

  //* Mostrar tareas o mostrar mensaje si no hay tareas 
  if (tasks.length === 0) {
    console.log(chalk.green.bold("No hay tareas por hacer"));
  } else {
    tasks.forEach((task, index) => {
      let status = task.completed ? "✅" : "❌";
      let indice = index + 1;

      if (task.completed) {
        console.log(chalk.greenBright(`${indice}. ${status} ${task.task}`));
      } else {
        console.log(chalk.redBright(`${indice}. ${status} ${task.task}`));
      }

    });

  }

  displayMenu();
  chooseOption();
}

//? Completa o marca un tarea como realizada
function completeTask() {
  rl.question(chalk.bgMagentaBright("Digite el nro. de la tarea a completar: "), (taskNro) => {
    //* Completar la tarea
    let index = parseInt(taskNro - 1);

    //* Si el numero de la tarea es mayor o igual a 0 y igual a la cantidad de tareas 
    if (index >= 0 && index < tasks.length) {
      tasks[index].completed = true;
      saveTask();

      console.log(chalk.green.bold("\nTarea completada con éxito ✅"));
    } else {
      console.log(chalk.red.bold("\nNúmero de tarea inválido"));
    }

    displayMenu();
    chooseOption();
  });
}


//? Elige una opcion de menu que especifiquemos 
function chooseOption() {
  rl.question("Digita el número de tu opción: ", (choice) => {
    switch (choice) {
      case "1":
        addTask();
        break;

      case "2":
        listTask();
        break;

      case "3":
        completeTask();
        break;

      case "4":
        console.log(chalk.yellow("Adiós 👋🦊"));
        //* Termina la entrada de datos 
        rl.close();
        break;

      default:
        console.log(chalk.red("\nOpción inválida, intenta nuevamente \n"));
        //* Muestra el menú nuevamente 
        displayMenu();
        chooseOption();
        break;
    }
  })
}

loadTasks();
displayMenu();
chooseOption();