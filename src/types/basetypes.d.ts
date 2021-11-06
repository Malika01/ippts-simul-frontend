/* Base types */

/* Represents a task. taskId should start from 0. */
export interface Task {
    expression: string,
    taskId: number
}

/* Represents a slave server. serverId should start from 0 .*/
export interface SlaveServer {
    url: string,
    serverId?: number
}
