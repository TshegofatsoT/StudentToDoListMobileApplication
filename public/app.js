const API = '/api/tasks';
let TASKS = [];
let CURRENT_FILTER = 'all';

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function ymd(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysLeft(date) {
  if (!date) return null;
  const today = new Date();
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - midnight) / (1000 * 60 * 60 * 24));
}

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

async function loadTasks() {
  TASKS = await api('GET', API);
  render();
}

function applyFilter(list) {
  if (CURRENT_FILTER === 'assignments') return list.filter((t) => t.type === 'Assignment');
  if (CURRENT_FILTER === 'exams') return list.filter((t) => t.type === 'Exam');
  if (CURRENT_FILTER === 'soon') return list.filter((t) => {
    const d = daysLeft(t.due);
    return d !== null && d >= 0 && d <= 7;
  });
  return list;
}

function sortTasks(a, b) {
  if (a.done !== b.done) return a.done - b.done; // undone first
  const ad = a.due ? new Date(a.due) : null;
  const bd = b.due ? new Date(b.due) : null;
  if (!ad && !bd) return 0;
  if (!ad) return 1;
  if (!bd) return -1;
  return ad - bd;
}

// Robust helper: handles both "id" (from toJSON) and legacy "_id"
function getId(t) {
  return t?.id || t?._id || null;
}

// ------------------- EVENT HANDLERS -------------------

$(document).ready(function () {
  loadTasks();

  // Add task
  $(document).on('submit', '#add-form', async function (e) {
    e.preventDefault();

    const task = {
      title: $('#title').val().trim(),
      course: $('#course').val().trim(),
      type: $('#type').val(),
      due: $('#due').val(),
    };

    try {
      await api('POST', API, task);
      $('#add-form')[0].reset();
      await loadTasks();

      Swal.fire({
        icon: 'success',
        title: 'Task Added!',
        text: 'Your task was successfully added.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (err) {
      Swal.fire('Error', 'Error adding task: ' + err.message, 'error');
    }
  });

  // Mark task as done
  $(document).on('click', '.mark-done', async function () {
    const id = $(this).data('id');
    if (!id) return Swal.fire('Error', 'Invalid task id.', 'error');
    try {
      await api('PATCH', `${API}/${id}`, { done: true });
      await loadTasks();

      Swal.fire({
        icon: 'success',
        title: 'Task Completed!',
        text: 'You marked this task as done ✅',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (err) {
      Swal.fire('Error', 'Error marking task done: ' + err.message, 'error');
    }
  });

  // Delete task
  $(document).on('click', '.delete-task', async function () {
    const id = $(this).data('id');
    if (!id) return Swal.fire('Error', 'Invalid task id.', 'error');

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This task will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      await api('DELETE', `${API}/${id}`);
      await loadTasks();

      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The task has been deleted.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (err) {
      Swal.fire('Error', 'Error deleting task: ' + err.message, 'error');
    }
  });

  // Optional filters (only if you still have #filters in the page)
  $(document).on('click', '#filters a', function (e) {
    e.preventDefault();
    $('#filters a').removeClass('active');
    $(this).addClass('active');
    CURRENT_FILTER = $(this).data('filter');
    render();
  });

  // Clear Completed Tasks
  $(document).on('click', '#clear-completed', async function () {
    const result = await Swal.fire({
      title: 'Clear completed tasks?',
      text: 'This will permanently delete all completed tasks!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, clear them!'
    });

    if (!result.isConfirmed) return;

    try {
      const completed = TASKS.filter(t => t.done);
      for (const t of completed) {
        await api('DELETE', `${API}/${t.id}`);
      }
      await loadTasks();

      Swal.fire({
        icon: 'success',
        title: 'Cleared!',
        text: 'All completed tasks were deleted.',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });

    } catch (err) {
      Swal.fire('Error', 'Error clearing completed tasks: ' + err.message, 'error');
    }
  });
});

// ------------------- RENDER -------------------

function render() {
  const $list = $('#task-list'); // tbody of the table
  $list.empty();

  const items = applyFilter([...TASKS]).sort(sortTasks);
  if (items.length === 0) {
    $list.append(`
      <tr>
        <td colspan="5" class="text-center">No tasks yet. Add your first one above. ✅</td>
      </tr>
    `);
    return;
  }

  for (const t of items) {
    const id = getId(t);
    const d = daysLeft(t.due);
    const overdue = d !== null && d < 0 && !t.done;
    const soon = d !== null && d >= 0 && d <= 3 && !t.done;

    const dueText = t.due
      ? `${ymd(t.due)}${d !== null ? ` (${d} day${Math.abs(d) === 1 ? '' : 's'} ${d < 0 ? 'ago' : 'left'})` : ''}`
      : 'No due date';

    $list.append(`
      <tr class="${t.done ? 'table-success' : ''} ${overdue ? 'table-danger' : ''} ${soon ? 'table-warning' : ''}">
        <td><strong>${t.title ?? ''}</strong></td>
        <td>${t.course ?? ''}</td>
        <td>${t.type ?? ''}</td>
        <td>${dueText}</td>
        <td>
          ${t.done ? '' : `<button class="btn btn-sm btn-success me-2 mark-done" data-id="${id}">
            <i class="fa fa-check"></i>
          </button>`}
          <button class="btn btn-sm btn-danger delete-task" data-id="${id}">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `);
  }
}
