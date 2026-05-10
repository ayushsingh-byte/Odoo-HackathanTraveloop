function tripCard(trip) {
  const daysLeft = trip.end_date ? Math.ceil((new Date(trip.end_date) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const status = !trip.end_date ? 'draft' : daysLeft < 0 ? 'completed' : daysLeft === 0 ? 'today' : daysLeft <= 7 ? 'soon' : 'upcoming';

  return `
    <div class="card card-trip" onclick="goToTrip('${trip.trip_id}')">
      ${trip.cover_image ? `<div class="card-img" style="background-image:url('${trip.cover_image}')"></div>` : '<div class="card-img" style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%)"></div>'}
      <div class="card-body">
        <h3 class="card-title">${trip.title || 'Untitled Trip'}</h3>
        <p class="card-text" style="color:#999;font-size:0.85rem">${trip.description ? trip.description.substring(0, 60) + (trip.description.length > 60 ? '...' : '') : 'No description'}</p>
        <div class="card-meta">
          <span class="badge badge-${status}">${status}</span>
          ${trip.start_date ? `<span style="font-size:0.8rem;color:#999">${fmt(trip.start_date)}</span>` : ''}
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation();editTrip('${trip.trip_id}')">Edit</button>
        <button class="btn btn-sm btn-danger-ghost" onclick="event.stopPropagation();deleteTrip('${trip.trip_id}')">Delete</button>
      </div>
    </div>
  `;
}

function cityCard(city) {
  return `
    <div class="card card-city" onclick="goToCity('${city.city_id}')">
      <div class="card-img" style="background-image:url('${city.image_url || '/images/city-default.png'}')">
        <div class="card-overlay"></div>
        <div class="card-badge">${city.popularity_score}% popular</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${city.city_name}</h3>
        <p class="card-text">${city.description ? city.description.substring(0, 80) + (city.description.length > 80 ? '...' : '') : ''}</p>
        <div class="card-meta">
          <span style="font-size:0.9rem">💵 ${fmtMoney(city.avg_daily_cost, 'USD')} per day</span>
        </div>
      </div>
    </div>
  `;
}

function activityCard(activity) {
  return `
    <div class="card card-activity" onclick="addActivityToTrip('${activity.activity_id}')">
      ${activity.image_url ? `<div class="card-img" style="background-image:url('${activity.image_url}')"></div>` : '<div class="card-img" style="background:#e0e7ff"></div>'}
      <div class="card-body">
        <h4 class="card-title">${activity.activity_name}</h4>
        <p class="card-text">${activity.description ? activity.description.substring(0, 60) + (activity.description.length > 60 ? '...' : '') : ''}</p>
        <div class="card-meta">
          <span>⭐ ${activity.rating}/5</span>
          <span>💵 ${fmtMoney(activity.estimated_cost)}</span>
          <span>⏱️ ${activity.estimated_duration_minutes}min</span>
        </div>
      </div>
    </div>
  `;
}

function checklistItemRow(item) {
  return `
    <div class="checklist-item${item.is_packed ? ' checked' : ''}">
      <input type="checkbox" ${item.is_packed ? 'checked' : ''} onchange="toggleChecklistItem(${item.item_id}, this.checked)">
      <span>${item.item_name}</span>
      <button class="btn btn-sm btn-danger-ghost" onclick="deleteChecklistItem(${item.item_id})">✕</button>
    </div>
  `;
}

function noteRow(note) {
  return `
    <div class="note-card">
      <div class="note-header">
        <h4>${note.note_title || 'Untitled Note'}</h4>
        <button class="btn btn-sm btn-danger-ghost" onclick="deleteNote(${note.note_id})">✕</button>
      </div>
      <p>${note.note_content || ''}</p>
      <small style="color:#999">${fmt(note.created_at)}</small>
    </div>
  `;
}

function budgetSummary(budget) {
  const total = budget.total_cost || 0;
  const spent = budget.transport_cost + budget.stay_cost + budget.food_cost + budget.activity_cost + budget.misc_cost;
  const remaining = (budget.total_budget || 0) - spent;

  return `
    <div class="budget-summary">
      <div class="budget-row">
        <span>Total Budget:</span>
        <strong>${fmtMoney(budget.total_budget, budget.currency)}</strong>
      </div>
      <div class="budget-row">
        <span>Spent:</span>
        <strong style="color:#e74c3c">${fmtMoney(spent, budget.currency)}</strong>
      </div>
      <div class="budget-row">
        <span>Remaining:</span>
        <strong style="color:${remaining >= 0 ? '#27ae60' : '#e74c3c'}">${fmtMoney(remaining, budget.currency)}</strong>
      </div>
      <div class="budget-bar">
        <div class="budget-fill" style="width:${spent > 0 && budget.total_budget > 0 ? Math.min(100, (spent / budget.total_budget) * 100) : 0}%"></div>
      </div>
    </div>
  `;
}

function budgetCategoryRow(label, amount, currency = 'USD') {
  return `
    <tr>
      <td>${label}</td>
      <td style="text-align:right">${fmtMoney(amount, currency)}</td>
    </tr>
  `;
}

async function goToTrip(tripId) {
  window.location.href = `/trip-view.html?id=${tripId}`;
}

async function goToCity(cityId) {
  const city = await API.get(`/api/cities/${cityId}`);
  if (city.error) {
    showAlert('Failed to load city');
    return;
  }
  document.getElementById('city-details').innerHTML = `
    <h2>${city.city_name}</h2>
    <p>${city.description}</p>
    <div id="city-activities"></div>
  `;
}

async function editTrip(tripId) {
  window.location.href = `/trip-builder.html?id=${tripId}`;
}

async function deleteTrip(tripId) {
  if (!confirm('Delete this trip? This cannot be undone.')) return;
  const result = await API.del(`/api/trips/${tripId}`);
  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Trip deleted', 'success');
  setTimeout(() => location.reload(), 1500);
}

async function addActivityToTrip(activityId) {
  const tripId = getParam('id');
  if (!tripId) {
    showAlert('No trip selected');
    return;
  }
  const result = await API.post(`/api/trips/${tripId}/activities`, { activity_id: activityId });
  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Activity added to trip', 'success');
  setTimeout(() => location.reload(), 1000);
}

async function toggleChecklistItem(itemId, checked) {
  const result = await API.patch(`/api/checklist/${itemId}`, { is_packed: checked });
  if (result.error) {
    showAlert(result.error);
  }
}

async function deleteChecklistItem(itemId) {
  const result = await API.del(`/api/checklist/${itemId}`);
  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Item removed', 'success');
  setTimeout(() => location.reload(), 800);
}

async function deleteNote(noteId) {
  if (!confirm('Delete this note?')) return;
  const result = await API.del(`/api/notes/${noteId}`);
  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Note deleted', 'success');
  setTimeout(() => location.reload(), 800);
}

async function saveNote(noteId = null) {
  const tripId = getParam('id');
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;

  if (!title || !content) {
    showAlert('Title and content required');
    return;
  }

  const method = noteId ? 'put' : 'post';
  const url = noteId ? `/api/notes/${noteId}` : '/api/notes';
  const result = await API[method](url, { trip_id: tripId, note_title: title, note_content: content });

  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Note saved', 'success');
  setTimeout(() => location.reload(), 800);
}

async function saveBudget(tripId) {
  const totalBudget = parseFloat(document.getElementById('total-budget').value);
  const transport = parseFloat(document.getElementById('transport-cost').value) || 0;
  const stay = parseFloat(document.getElementById('stay-cost').value) || 0;
  const food = parseFloat(document.getElementById('food-cost').value) || 0;
  const activity = parseFloat(document.getElementById('activity-cost').value) || 0;
  const misc = parseFloat(document.getElementById('misc-cost').value) || 0;

  const result = await API.put(`/api/budget/${tripId}`, {
    total_budget: totalBudget,
    transport_cost: transport,
    stay_cost: stay,
    food_cost: food,
    activity_cost: activity,
    misc_cost: misc
  });

  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Budget updated', 'success');
}

async function deleteChecklistItem(itemId) {
  const result = await API.del(`/api/checklist/${itemId}`);
  if (result.error) {
    showAlert(result.error);
    return;
  }
  showAlert('Item removed', 'success');
  setTimeout(() => location.reload(), 800);
}

function formatActivityCategory(categoryId) {
  const categories = {
    1: 'Sightseeing',
    2: 'Food & Dining',
    3: 'Adventure',
    4: 'Culture',
    5: 'Shopping',
    6: 'Nature',
    7: 'Nightlife',
    8: 'Wellness'
  };
  return categories[categoryId] || 'Activity';
}

function userCard(user) {
  return `
    <div class="card card-user">
      <div class="user-avatar" style="width:60px;height:60px;background:#667eea;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1.5rem;font-weight:bold">${user.name.charAt(0).toUpperCase()}</div>
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <small style="color:#999">${user.role}</small>
    </div>
  `;
}

function itineraryStop(stop) {
  return `
    <div class="itinerary-stop">
      <div class="stop-date">${fmt(stop.arrival_date)} - ${fmt(stop.departure_date)}</div>
      <h4>${stop.city_name}</h4>
      <p>${stop.notes || 'No notes'}</p>
    </div>
  `;
}
