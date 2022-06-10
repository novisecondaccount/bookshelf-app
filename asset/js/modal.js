const Modal = {
    init() {
        this.confirmation = false;
        this.el = document.createElement('div');
        this.el.className = 'modal'

        this.title = document.createElement('div')
        this.title.className = 'modal-header'
        this.title.textContent = 'Yakin Hapus?'

        this.content = document.createElement('p')
        
        this.btnNo = document.createElement('button')
        this.btnNo.textContent = "No, Cancel"
        this.btnNo.className = "secondary"
        this.btnYes = document.createElement('button')
        this.btnYes.textContent = "Yes, Delete"
        this.btnYes.className = "danger"
        
        this.el.append(this.title, this.content, this.btnNo, this.btnYes)
        document.body.append(this.el)
        
    },
    show(data) {
        this.confirmation =null;
        this.state = true
        this.content.textContent = data + " akan dihapus"
        this.el.className = 'modal modal-visible';
    },
    hidden() {
        this.el.className = 'modal';
    },

    
    
}

document.addEventListener("DOMContentLoaded", () => {
    Modal.init();
 
})

