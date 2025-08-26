import { client } from "@/lib/client";
import { create } from "zustand";

type newTaskData = {
	task_name: string;
	description: string;
};

type TodoStoreArgs = {
	todos: any;
	getTodo: () => Promise<void>;
	createTodo: (newTask: newTaskData) => Promise<void>;
	deleteTodo: (taskId: any) => Promise<void>;
	updateTodo: (taskId: any, updateData: any) => Promise<any>;
};

export const useTodoStore = create<TodoStoreArgs>((set) => ({
	todos: null,
	getTodo: async () => {
		try {
			// const todoData = await api.get("/all-todos");
			const res = await client.api["all-todos"].$get();
			const todoData = await res.json();
			set({ todos: todoData });
		} catch (error) {
			console.error("Error fetching todos:", error);
		}
	},
	createTodo: async (newTask: newTaskData) => {
		try {
			const newTodo = await client.api["add-todo"].$post({
				json: newTask,
			});
			const res = await newTodo.json();
			console.log(res[0]);
			return res[0];
		} catch (error) {
			console.error("Error creating todo:", error);
		}
	},
	deleteTodo: async (taskId: string) => {
		try {
			await client.api.todo[":id"].$delete({
				param: {
					id: taskId,
				},
			});
			// await api.delete(`/todo/${taskId}`);
			set((state) => ({
				todos: state.todos.filter((t: any) => t.id !== taskId),
			}));
		} catch (error) {
			console.error("Delete failed:", error);
		}
	},
	updateTodo: async (taskId: string, updateData: any) => {
		try {
			const res = await client.api.todo[":id"].$put({
				param: { id: taskId },
				json: updateData,
			});
			const data = await res.json();
			return data[0];
		} catch (error) {}
	},
}));
