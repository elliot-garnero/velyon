class Slider
{

  constructor(timer)
  {
    this.timer = timer;

    this.popup();
    this.controls();

    this.itemCount = document.querySelectorAll('.carousel li.items').length;
  }

  popup()
  {
    $('.button').click(() =>
    {
      let buttonId = $('.button').attr('id');
      $('#popup-container').removeAttr('class').addClass(buttonId);
      $('body').addClass('popup-active');
    })
    
    $('#popup-container').click(() =>
    {
      $('#popup-container').addClass('out');
      $('body').removeClass('popup-active');
    })
  }

  controls()
  {
    $('#previous').click(() => this.previous());
    $('#next').click(() => this.next())
  }

  previous()
  {
    $('.previous').toggleClass('pulse');
    setTimeout(()=> $('.previous').removeClass('pulse'), 100)

    this.swap('counter-clockwise');
    clearInterval(this.autoSwap);
    this.autoSwap = setInterval(() => this.swap(''), this.timer)
  }

  next()
  {
    $('.next').toggleClass('pulse');
    setTimeout(()=> $('.next').removeClass('pulse'), 100)

    this.swap('clockwise');
    clearInterval(this.autoSwap);
    this.autoSwap = setInterval(() => this.swap(''), this.timer)
  }

  swap(direction) 
  { 
    if (direction == 'counter-clockwise') 
    {
      // Defines pivot element
      let leftposition = $('.left-pos').attr('id') - 1;
      if (leftposition == 0)
      {
        leftposition = this.itemCount;
      }
      $('.hide-pos').removeClass('hide-pos').addClass('right-pos');
      $('.right-pos').removeClass('right-pos').addClass('back-pos');
      $('.main-pos').removeClass('main-pos').addClass('right-pos');
      $('.left-pos').removeClass('left-pos').addClass('main-pos');
      $('#'+ leftposition + '').removeClass('back-pos').addClass('left-pos');
    }

    if (direction == 'clockwise' || direction == '' || direction == null ) 
    {       
      let rightitem = $('.right-pos').attr('id');
      let leftitem = $('.left-pos').attr('id');
      let frontitem = $('.main-pos').attr('id');
      let backitem = $('.back-pos').attr('id');
      let hideitem = $('.hide-pos').attr('id');
      $('#'+frontitem+'').removeClass('main-pos').addClass('left-pos');        
      $('#'+leftitem+'').removeClass('left-pos').addClass('hide-pos');
      $('#'+hideitem+'').removeClass('hide-pos').addClass('back-pos');
      $('#'+backitem+'').removeClass('back-pos').addClass('right-pos'); 
      $('#'+rightitem+'').removeClass('right-pos').addClass('main-pos');
    }
  }
}