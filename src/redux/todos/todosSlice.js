//completed basılırsa işlem görmesi geliştirilecek, backend tarafında root url vb. ayarlamak gerekiyor.
import { createSlice } from "@reduxjs/toolkit";

import { getTodosAsync, addTodosAsync, toggleTodosAsync, removeTodosAsync } from "./services";

// export const getTodosAsync = createAsyncThunk('todos/getTodosAsync', async () => {
//     const res = await fetch('http://localhost:7000/todos');
//     return await res.json()
// })
//bunun yerine axios tercih ettik


export const todosSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        activeFilter: localStorage.getItem('activeFilter'),
        // addNewTodoIsLoading: false,
        // addNewTodoError: null,
        addNewTodo: {
            isLoading: false,
            error: false,
        },
    },
    reducers: {
        // addTodo: {
        //     reducer: (state, action) => {
        //         state.items.push(action.payload)
        //     },
        //     prepare: ({ title }) => {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 completed: false,
        //                 title,
        //             }
        //         }
        //     },
        // },
        //bunu yerine backend işlemlerini tercih ettik
        // toggle: (state, action) => {
        //     const { id } = action.payload;
        //     const item = state.items.find(item => item.id === id)
        //     item.completed = !item.completed;
        // },
        //middleware ile hallettik
        // destroy: (state, action) => {
        //     const id = action.payload;
        //     const filtered = state.items.filter((item) => item.id !== id);
        //     state.items = filtered;
        // },
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload
        },
        clearCompleted: (state) => {
            const filtered = state.items.filter((item) => item.completed === false);
            state.items = filtered;
        },
    },
    extraReducers: {
        // get todos
        [getTodosAsync.pending]: (state, action) => {
            state.isLoading = true;
        },
        [getTodosAsync.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.isLoading = false;
        },
        [getTodosAsync.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        },
        // add todo
        [addTodosAsync.pending]: (state, action) => {
            state.addNewTodo.isLoading = true
        },
        [addTodosAsync.fulfilled]: (state, action) => {
            state.items.push(action.payload)
            state.addNewTodo.IsLoading = false
        },
        [addTodosAsync.rejected]: (state, action) => {
            state.addNewTodo.IsLoading = false;
            state.addNewTodo.Error = action.error.message;
        },
        // toggle todo
        [toggleTodosAsync.fulfilled]: (state, action) => {
            const { id, completed } = action.payload
            const index = state.items.findIndex(item => item.id === id);
            state.items[index].completed = completed
        },
        // remove todo
        // [removeTodosAsync.fulfilled]: (state, action) => {
        //     const id = action.payload;
        //     const filtered = state.items.filter((item) => item.id !== id);
        //     state.items = filtered;
        // },
        // veya alttaki kullanılabilir
        [removeTodosAsync.fulfilled]: (state, action) => {
            const id = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items.splice(index, 1)
        }
    }
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
    if (state.todos.activeFilter === 'all') {
        return state.todos.items;
    }
    return state.todos.items.filter((todo) => state.todos.activeFilter === 'active' ? todo.completed === false : todo.completed === true)
}

export const { changeActiveFilter, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;