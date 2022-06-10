const tambah = document.getElementsByClassName('tambah')[0];
const cariJudul = document.getElementById('cari');
const wadah = document.getElementById('blur');
const form = document.getElementById('formbuku');
document.addEventListener('DOMContentLoaded', function() {
    const formBuku = document.getElementById('formbuku');
    formBuku.addEventListener('submit', function (event){
        event.preventDefault();
        const idBuku = document.getElementById('idBuku').value
       
        if(idBuku == "") {
            let check =  validationForm()
            if(check) {
                addBook();
                toogleForm();
            }
        }else {
            let check = validationForm()
            if (check) {
                updateBook(idBuku);
                toogleForm();
            }

        }
    })
    if(isStorageExist) {
        loadDataFromStorage();
    }
})
function toogleForm() {
    let id = document.getElementById('idBuku').value
    if(id !== "") {
        resetField()
    }else {
        resetError()
    }
    wadah.classList.toggle("active")
    form.classList.toggle('active') 
}
function toogleUpdateForm(bookObj) {
    wadah.classList.toggle("active")
    form.classList.toggle('active') 
    document.getElementById('idBuku').value = bookObj.id
    document.getElementById('judul').value = bookObj.judul
    document.getElementById('author').value = bookObj.author
    document.getElementById('tahun').value = bookObj.tahun
}
tambah.addEventListener("click", toogleForm)
cariJudul.addEventListener("keyup", filterBuku);


const books = [];
const RENDER_EVENT = 'render-buku';

function validationForm() {
    let error = 3;
    const judul = document.getElementById('judul')
    const author = document.getElementById('author')
    const tahun = document.getElementById('tahun')
    const fieldJudul = document.getElementById('fJudul')
    const fieldAuthor = document.getElementById('fAuthor')
    const fieldTahun = document.getElementById('fTahun')
    
    if(judul.value == '') {
        fieldJudul.innerText = "Judul tidak boleh kosong"
    }else{
        fieldJudul.innerText = ""
        error -= 1
    }
    if(author.value == '') {
        fieldAuthor.innerText = "Author tidak boleh kosong"
    }else {
        fieldAuthor.innerText = ""
        error -= 1
    }
    if(tahun.value == '') {
        fieldTahun.innerText = "Tahun tidak boleh kosong"
    }else if(isNaN(tahun.value)){
        fieldTahun.innerText = "Tahun harus dalam bentuk angka"
    }else {
        fieldTahun.innerText = ""
        error -= 1
    }
    return error == 0
}
function filterBuku(e) {
    let listBuku = document.querySelectorAll('.info-buku')
    let keyword = e.target.value.toLowerCase()
    listBuku.forEach((buku)=>{
       let judulBuku = buku.firstChild.textContent.toLowerCase()
        if(judulBuku.indexOf(keyword) != -1) {
            buku.parentElement.setAttribute('style', 'display:flex')
        }    
        else{  
            buku.parentElement.setAttribute('style', 'display: none !important')
            notFound();
        }
    })
}
function notFound() { //fungsi untuk menampilkan toast not found jika tidak ada buku yang ditemukan
    const list = document.querySelectorAll('.item-buku')
    let notFound = 0;
    list.forEach((info) =>{
        const style = getComputedStyle(info)
        if(style.display == 'none') {
            notFound++;
        }
    })
    if(notFound == books.length) {
        Toast.show("Buku yang dicari tidak ada ditemukan", 'error')
    }
}
function addBook() {
    const judul = document.getElementById('judul').value;
    const author = document.getElementById('author').value;
    const tahun = document.getElementById('tahun').value;
    const idBuku = generateId();

    const bookObject = generateBookObject(idBuku, judul, author, tahun, false);
  
    books.push(bookObject);
    Toast.show("Buku berhasil disimpan", "success")
    resetField();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}
function resetField() {
    document.getElementById('idBuku').value = ""
    document.getElementById('judul').value = ""
    document.getElementById('author').value = ""
    document.getElementById('tahun').value = ""

}
function resetError() {
    document.getElementById('fJudul').textContent = ""
    document.getElementById('fAuthor').textContent = ""
    document.getElementById('fTahun').textContent = ""
}
function updateBook(idBuku) {
    const judul = document.getElementById('judul').value;
    const author = document.getElementById('author').value;
    const tahun = document.getElementById('tahun').value;
    let index = findBookIndex(idBuku)
    const isCompleted = books[index].isCompleted
    const bookObject = generateBookObject(idBuku, judul, author, tahun, isCompleted)
    books[index] = bookObject;
    Toast.show("Buku berhasil diupdate", "success")
    resetField();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}
function generateId() {
    return +new Date();
}
function generateBookObject(id, judul, author, tahun, isCompleted) {
    return {
        id,
        judul,
        author,
        tahun,
        isCompleted,
    }
}
document.addEventListener(RENDER_EVENT, function() {
    const ongoingBookList = document.getElementById('buku-ongoing');
    ongoingBookList.innerHTML = "";

    const finishedBookList = document.getElementById('buku-selesai');
    finishedBookList.innerHTML = "";

    for (const book of books) {
        const bookElement = makeRakBuku(book)
        if(book.isCompleted) {
           finishedBookList.append(bookElement) 
         
        }else{
           ongoingBookList.append(bookElement)
          
        }
    }
    updateDisplay();

})

function makeRakBuku(bookObject) {
    const textJudul = document.createElement("h3")
    let judul = ""
    if(bookObject.judul.length > 45) {
        judul = bookObject.judul.substring(0,45) + ". . ."
    }else {
        judul = bookObject.judul
    }
    textJudul.innerText = judul

    const textAuthor = document.createElement("p")
    textAuthor.innerText = bookObject.author

    const textTahun = document.createElement("p")
    textTahun.innerText = bookObject.tahun

    const infoBuku = document.createElement("div")
    infoBuku.classList.add("info-buku")
    infoBuku.append(textJudul, textAuthor, textTahun)

    const rak = document.createElement("div")
    rak.classList.add("item-buku")
    rak.append(infoBuku)
    rak.setAttribute('id', '`book-${bookObject.id}`')

    if(bookObject.isCompleted) {
        const crudBuku = document.createElement("div")
        crudBuku.classList.add("crud-buku")

        const buttonEdit = document.createElement("button")
        buttonEdit.classList.add('edit-button')
        buttonEdit.addEventListener("click", function(){
            toogleUpdateForm(bookObject)
        })

        const undoButton = document.createElement("button")
        undoButton.classList.add("undo-button")
 
        undoButton.addEventListener("click", function() {
            undoBookFromFinished(bookObject.id)
        })

        const buttonHapus = document.createElement("button")
        buttonHapus.classList.add('trash-button')

        buttonHapus.addEventListener("click", function() {
            confirmationBeforeDelete(bookObject)  
        })
        crudBuku.append(buttonEdit, undoButton, buttonHapus)
        rak.append(crudBuku)
    }else {
        const crudBuku = document.createElement("div")
        crudBuku.classList.add("crud-buku")

        const buttonEdit = document.createElement("button")
        buttonEdit.classList.add('edit-button')
        buttonEdit.addEventListener("click", function(){
            toogleUpdateForm(bookObject)
        })
        const buttonSelesai = document.createElement("button")
        buttonSelesai.classList.add('check-button')
        buttonSelesai.addEventListener("click", function() {
            addBookToFinished(bookObject.id)
        })

        const buttonHapus = document.createElement("button")
        buttonHapus.classList.add('trash-button')
    
        buttonHapus.addEventListener("click", function() {
            confirmationBeforeDelete(bookObject)  
        })
        crudBuku.append(buttonEdit, buttonSelesai, buttonHapus)
        rak.append(crudBuku)
    }
    return rak;
}

function addBookToFinished(bookId) {
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;

    bookTarget.isCompleted = true;

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}
function updateDisplay() {
    let nBelum = 0;
    let nSelesai = 0;
    let nTotal = books.length;
    for (let index = 0; index < books.length; index++) {
       if(books[index].isCompleted) {
           nSelesai++;
       }else{
           nBelum++;
       }
    }
    
    let hasilBelum = document.getElementById('belumbaca')
    let hasilSudah = document.getElementById('selesaibaca')
    let total = document.getElementById('total-buku')
    hasilBelum.innerText = nBelum;
    hasilSudah.innerText = nSelesai;
    total.innerText = nTotal;
}
function findBook(bookId) {
    for (const book of books) {
        if(book.id === bookId)
        return book
    }
    return null;
}
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }
    return -1;
}

function undoBookFromFinished(bookId) {
    const bookTarget = findBook(bookId)
    if(bookTarget == null) return;
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData();
}
function confirmationBeforeDelete(bookObject){
    Modal.show(bookObject.judul)
    let btnNo = document.getElementsByClassName("secondary")[0]
    btnNo.addEventListener("click", function() {
        Modal.hidden()
    })
    let btnYes = document.getElementsByClassName("danger")[0]
    btnYes.addEventListener("click", function() {
        removeBook(bookObject.id)         
        Modal.hidden()

    })

}
function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);
    Toast.show("Buku berhasil dihapus", "success")
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = "BOOKSHELF_APPS";

function saveData() {
    if(isStorageExist) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}
function isStorageExist(){
    if(typeof (Storage) === undefined) {
        alert("Browser tidak mendukung local storage")
        return false;
    }
    return true;
}
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const dataStorage = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataStorage);

    if(data!= null){
        for (const book of data) {
            books.push(book)
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}