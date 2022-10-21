class Booking
{
    constructor()
    {
        this.inputValidation = false;
        this.appendTimerModal()
        this.setTimerInterval()
    }

    displayForm()
    {
        let basicElements = FormBuilder.basicElements();
        let firstForm = FormBuilder.firstForm();
        let closeBtn = FormBuilder.closeButton();

        for (let i = 0; i < firstForm.length; i++) { firstForm[0].append(firstForm[i]) }
        basicElements[0].prepend(basicElements[1]);
        basicElements[1].append(firstForm[0]);
        setTimeout(() => document.getElementById("user-info").style.transform = "translate(0)", 50); 

        closeBtn[0].append(closeBtn[1]);
        basicElements[1].append(closeBtn[0]);
        document.getElementById('closeForm').addEventListener('click', () => this.closeForm())

        $('#successMessage').remove();
        $('#bookForm').remove();
        $('#options').remove(); 
        this.open = false;

        this.bookAction();
        $('#user-info').bind('touchmove', (e) => e.preventDefault())
    }

    closeForm()
    {
        $('form').fadeOut('slow');
        $('#successMessage').fadeOut('slow');
        let animClass = $('.circle').data('animation');
        $('.circle').addClass(animClass);
    
        setTimeout(() => 
        {
            $("#user-info").css(
            {
                "min-width": "0px", 
                "max-width": "0px"
            });
        }, 300)
        setTimeout(() => $("#user-info").remove(),800)
        
        setTimeout(() => $('.circle').removeClass(animClass), 1000);
        if (sessionStorage.getItem('timestamp') != null)
        {
            $('#cancelModal').fadeIn('slow');
        }
    }

    bookAction()
    {
        document.getElementById('submit').addEventListener('click', () =>
        {
            if (document.getElementById('modal') != null) { this.openDialog() }
            else { this.book() }
        })
    }

    openDialog()
    {
        if (this.open === false)
        {
            let dialog = FormBuilder.dialogModal();
            dialog[1].append(dialog[2], dialog[3])
            dialog[4].append(dialog[5], dialog[6])
            dialog[0].append(dialog[1], dialog[4]) 
            $('#map-container').append(dialog[0])
            $('#modal-example').fadeIn();

            document.getElementById('continue').addEventListener('click', () => 
            {
                sessionStorage.removeItem('position');
                sessionStorage.removeItem('name'); 
                $('dialog').fadeOut('slow');
                $('dialog').remove();
                this.clearTimerInterval();
                this.removeTimerModal();
                this.book();
            })

            document.getElementById('closeDialog').addEventListener('click', () => 
            {
                this.open = false;
                $('dialog').fadeOut('slow');
                $('dialog').remove();
            })
            this.open = true;
        }
    }

    book()
    {   
        sessionStorage.setItem('position', JSON.stringify(sessionStorage.getItem('latlng')));
        sessionStorage.setItem('station', JSON.stringify(sessionStorage.getItem('station_name')));
        clearInterval(this.interval);
        $('#infoForm').hide();
        let secondForm = FormBuilder.secondForm();
        for (let i = 1; i <= 10; i++) { secondForm[0].append(secondForm[i]) }
        for (let j = 7 ; j <= 9; j++) { secondForm[7].append(secondForm[j]) }

        $('#user-info').append(secondForm[0]);

        if (typeof localStorage.getItem("name") != "null" && typeof localStorage.getItem("surname") != "null") 
        {
            document.getElementById("name").value = localStorage.getItem("name");
            document.getElementById("surname").value = localStorage.getItem("surname");
        }
        this.name = document.getElementById('name');
        this.surname = document.getElementById('surname');
        this.inputListener();
        document.getElementById('previousForm').addEventListener('click', () => this.previous())
        document.getElementById('nextForm').addEventListener('click', () => this.next())
    }
    
    previous()
    {
        $('#bookForm').remove();    
        $('#options').remove();                    
        $('#infoForm').fadeIn('slow');
    }

    checkInput(elt)
    {
        if (elt.value.length > 0 && RegExp(/^[a-zA-Z\-*\ *]+$/).test(elt.value) == true) 
        {
            elt.style.borderColor = 'green';
            elt.style.borderColor = 'green';
            elt.style.outline = 'none';
            elt.classList.remove('invalid');
            elt.classList.add('valid'); 
            return this.inputValidation = true;
        } 
        else
        {
            elt.style.borderColor = "red";
            elt.classList.remove('valid');
            elt.classList.add('invalid');
        }       
    }

    inputListener()
    {
        if (localStorage.getItem('name') != null && localStorage.getItem('surname') != null) 
        {
            this.checkInput(this.name);
            this.checkInput(this.surname);
        }
        else if (localStorage.getItem('name') === null && localStorage.getItem('surname') === null)
        {
            this.name.addEventListener('blur', () => this.checkInput(this.name))        
            this.surname.addEventListener('blur', () => this.checkInput(this.surname))       
        }
    }

    setTimerInterval()
    {
        setInterval(() =>
        {
            this.timestamp = sessionStorage.getItem("timestamp");
            let now = this.timestamp - Date.now();
            now = now / 1000
            let component = (a,b) => Math.floor(a / b);
            let minutes = component(now,60) % 60;
            let seconds = component(now,1) % 60;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            $('#timer').html(minutes + ":" + seconds);
            if (seconds == 0 && minutes == 0)
            { 
                this.cancelBooking();
            }
        }, 1000)
    }

    cancelBooking()
    {
        this.removeTimerModal()
        this.clearTimerInterval()
        $('#successMessage').fadeOut('slow');
        if (document.getElementById("user-info") != null)
        {
            setTimeout(() => 
            {
                $("#user-info").css(
                {
                    "min-width": "0px", 
                    "max-width": "0px"
                });
            }, 300)        
            setTimeout(() => $("#user-info").remove(),800)
        }
        this.centerMap = map.map.flyTo(L.latLng(45.764043, 4.835659), 14)
    }

    clearTimerInterval()
    {
        sessionStorage.removeItem('timestamp');
        sessionStorage.removeItem('position');
        clearInterval(this.interval);
    }

    findMyStation()
    {
        let latlng = JSON.parse(sessionStorage.getItem('position')).split(","); 
        let station = sessionStorage.getItem('station');    
        this.reset = map.map.flyTo(L.latLng(latlng), 16);
        this.popup = L.popup()
            .setLatLng(latlng)
            .setContent(station.substr(7))
            .openOn(map.map)
    }

    appendTimerModal()
    {
        if (sessionStorage.getItem('timestamp') != null)
        {
            let modal = FormBuilder.timerModal();
            console.log(document.getElementById('user-info') === null)
            
            for (let i = 0; i < modal.length ; i++) { modal[0].append(modal[i])}
            $('body').append(modal[0]);
            if (document.getElementById('user-info') != null) { $('#cancelModal').hide() }
            document.getElementById('cancelModal').addEventListener('click', () => this.cancelBooking())
            document.getElementById('locate').addEventListener('click', () => this.findMyStation())
        }
    }

    removeTimerModal()
    {
        document.getElementById('modal').style.height = "0";
        setTimeout( () => $('#modal').remove(), 600); 
    }

    validationForm() 
    {
        $('#successMessage').remove();
        $('#bookForm').hide(); 
        $('#options').remove();

        let thirdForm = FormBuilder.thirdForm(); 
        for (let i = 0; i < thirdForm.length; i++) { thirdForm[0].append(thirdForm[i]); }
        thirdForm[2].append(thirdForm[3]);
        $('#user-info').append(thirdForm[0]);
    }

    next()
    {
        if (this.checkInput(this.name) && this.checkInput(this.surname))
        {
            localStorage.setItem('name',document.getElementById('name').value);
            localStorage.setItem('surname',document.getElementById('surname').value); 
            let expire = Date.now() + 1200000; //20min

            sessionStorage.setItem('timestamp', expire);
            sessionStorage.setItem('position', JSON.stringify(sessionStorage.getItem('latlng')));
            sessionStorage.setItem('station', sessionStorage.getItem('station_name'));  
            this.interval = this.setTimerInterval()

            this.appendTimerModal();
            this.validationForm()

            $('#cancelReservation').addClass('cancelbtn');
            document.getElementById('cancelReservation').addEventListener('click', () => this.cancelBooking())
        }
        else if (this.inputValidation == false)
        {
            document.getElementById('name').style.borderColor = "red";
            document.getElementById('surname').style.borderColor = "red";
        }
    }
}