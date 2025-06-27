$(document).ready(function() {
    let sortOrder = 'desc'; 
    

    function toggleTheme() {
        $('body').toggleClass('light-theme');
        const isLight = $('body').hasClass('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        $('#theme-toggle').text(isLight ? 'Темна тема' : 'Світла тема');
    }

   
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        $('body').addClass('light-theme');
        $('#theme-toggle').text('Темна тема');
    } else {
        $('body').removeClass('light-theme');
        $('#theme-toggle').text('Світла тема');
    }

    $('#theme-toggle').click(toggleTheme);

    function loadNotes() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        const notesContainer = $('#notes-container');
        notesContainer.empty();
        
        notes = sortNotesByDate(notes, sortOrder);
        
        notes.forEach((note, index) => {
            const noteDate = new Date(note.date);
            const formattedDate = noteDate.toLocaleString();
            
            const noteElement = $(`
                <div class="note" data-id="${index}">
                    <h2>${note.title}</h2>
                    <p>${note.content}</p>
                    <p class="note-date">Створено: ${formattedDate}</p>
                    <button class="delete-btn">Видалити</button>
                </div>
            `);
            
            notesContainer.append(noteElement);
        });
        
        $('.delete-btn').click(function(e) {
            e.stopPropagation(); 
            const noteId = $(this).parent().data('id');
            deleteNote(noteId);
        });

        $('.note').click(function() {
            const currentOpacity = $(this).css('opacity');
            $(this).css('opacity', currentOpacity === '1' ? '0.5' : '1');
        });

        $('.note').dblclick(function() {
            const noteId = $(this).data('id');
            editNote(noteId);
        });
    }

    function sortNotesByDate(notes, order = 'desc') {
        return notes.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            if (order === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        });
    }
  
    function addNote(title, content) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const currentDate = new Date().toISOString();
        notes.push({ 
            title, 
            content, 
            date: currentDate 
        });
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }

    function deleteNote(id) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(id, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }

    function editNote(id) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const note = notes[id];
        
        const noteElement = $(`.note[data-id="${id}"]`);
        noteElement.html(`
            <input type="text" class="edit-title" value="${note.title}">
            <textarea class="edit-content">${note.content}</textarea>
            <button class="save-btn">Зберегти</button>
            <button class="cancel-btn">Скасувати</button>
        `);
        
        noteElement.find('.save-btn').click(function() {
            const newTitle = noteElement.find('.edit-title').val();
            const newContent = noteElement.find('.edit-content').val();
            
            if (newTitle && newContent) {
                notes[id] = { 
                    title: newTitle, 
                    content: newContent, 
                    date: note.date 
                };
                localStorage.setItem('notes', JSON.stringify(notes));
                loadNotes();
            } else {
                alert('Будь ласка, заповніть обидва поля!');
            }
        });
        
        noteElement.find('.cancel-btn').click(function() {
            loadNotes();
        });
    }

    $('#add-note-btn').click(function() {
        const title = $('#note-title').val();
        const content = $('#note-content').val();
        
        if (title && content) {
            addNote(title, content);
            $('#note-title').val('');
            $('#note-content').val('');
        } else {
            alert('Будь ласка, заповніть обидва поля!');
        }
    });

    $('#sort-btn').click(function() {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        $(this).text(sortOrder === 'asc' ? 'Сортувати за датою (нові)' : 'Сортувати за датою (старі)');
        loadNotes();
    });

    loadNotes();
});