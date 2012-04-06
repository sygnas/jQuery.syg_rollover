/*****************************************

jQuery.syg_rollover
version 1.2
Hiroshi Fukuda <dada@sygnas.jp>
http://sygnas.jp/

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

/*****************************************

/*****************************************
= example 1 =

	<img src="img/swap_01.png" width="78" height="55" class="swap" />
	<img src="img/swap_02.png" width="78" height="55" class="swap" />

	<script>
		new $.SygRollover( '.swap' );
	</script>


= example 2 =

	<img src="img/swap_01.png" width="78" height="55" class="swap2" />
	<img src="img/swap_02.png" width="78" height="55" class="swap2 active" />

	<script>
		new $.SygRollover( '.swap2', { radio:true } );
	</script>

*****************************************/
/*****************************************
= common parameters =

	mode			"swap" / "scroll" / "fade"
	radio			false / true
					radio group

= swap mode parameters =
	swapExt			"-over"
					"file.jpg" and "file-over.jpg"

= fade mode parameters =
			
	fadeOverTime	200
	fadeOutTime		1000
	fadeOverOpacity	0.5
	fadeOutOpacity	1

= common parameters =

	scrollEasing	"swing" / "linear"
					jquery.easing.js is required if you would like to use other easings. 
	scrollTime		200
	scrollOver		[x,y]
	scrollOut		[x,y]
	effectTarget	"self" or function

					function( target ){
						return $(target).prev();
						
					}

*****************************************/


(function( jQuery ){
	
	/*************************
	* constructor
	*/
	jQuery.SygRollover = function( target, config ){
		
		// default parameters
		var defaults = {
			mode:			'swap',
			radio:			false,
			effectTarget:	'self',
			
			// scroll mode options
			scrollEasing:	'swing',
			scrollTime:		200,
			scrollOut:		[0,0],
			scrollOver:		[0,-10],
			// effectTarget:	'self',		Å© effectTarget Ç…ìùçá
			
			// swap mode options
			swapExt:		"-over",
			
			// fade mode options
			fadeOverTime:	200,
			fadeOutTime:	1000,
			fadeOverOpacity:0.5,
			fadeOutOpacity:	1
		};
		/******/

		this.opt = jQuery.extend( defaults, config );
		this.buttons = [];
		this.active;

		var buttons = this.buttons;
		var self = this;
		
		
		
		// initialize
		var opt = this.opt;
		var count = 0;
		
		jQuery( target ).each( function(){
			
			var effectTarget;

			// set scroll target
			if( opt.effectTarget == 'self' ){
				effectTarget = this;
			}else if( typeof opt.effectTarget == 'function' ){
				effectTarget = opt.effectTarget( this );
			}
			
			// select mode
			switch( opt.mode ){
				
				case "swap":
					buttons.push( new jQuery.SygRolloverSwap( this, effectTarget, opt ) );
					break;
				case "scroll":
					buttons.push( new jQuery.SygRolloverScroll( this, effectTarget, opt ) );
					break;
				case "fade":
					buttons.push( new jQuery.SygRolloverFade( this, effectTarget, opt ) );
					break;
			}

			this.sygRolloverID = count;
			
			if( jQuery(this).is('.active') ){
				self.rollover( count, true );
				self.active = buttons[count];
			}else{
				self.rollout( count, true );
			}
			
			count ++;
			
		});
		
		/*****************************
		* hover setting
		*/
		jQuery( target ).hover(
			jQuery.proxy(
				function( e ){
					self.rollover( e.currentTarget.sygRolloverID ) ;
				},
				self
			),
			jQuery.proxy(
				function( e ){
					self.rollout( e.currentTarget.sygRolloverID ) ;
				},
				self
			)
		);
		
		/*****************************
		* click setting
		*/
		jQuery( target ).click( function( e ){
			self.select( e.currentTarget.sygRolloverID );
		});
		
	};
	
	/*****************************
	* select button
	*/
	jQuery.SygRollover.prototype.select = function( id ){
		var opt = this.opt;
		
		if( !opt.radio ) return;
		
		// remove active
		if( this.active ){
			jQuery( this.active.target ).removeClass('active');
			this.rollout( this.active.target.sygRolloverID, true );
		}
		
		// set active
		jQuery( this.buttons[id].target ).addClass('active');
		this.active = this.buttons[ id ];
		this.rollover( id, true );
	}
	
	/*****************************
	* set rollover
	*/
	jQuery.SygRollover.prototype.rollover = function( id, exec ){
		var opt = this.opt;
		
		if( !exec && this.buttons[id].isActive() ){ return; }
		
		this.buttons[id].rollover();
	}
	
	/*****************************
	* set rollout
	*/
	jQuery.SygRollover.prototype.rollout = function( id, exec ){
		var opt = this.opt;
		
		if( !exec && this.buttons[id].isActive() ){ return; }
		
		this.buttons[id].rollout();
	}
	
	/////////////////////////////////////////////////
	// swap class
	/////////////////////////////////////////////////
	
	/**************
	* constructor
	*/
	jQuery.SygRolloverSwap = function( target, effectTarget, opt ){
		this.target = target;
		this.effectTarget = effectTarget;
		
		this.imgsrc = effectTarget.src;
		var dotpos = this.imgsrc.lastIndexOf('.');
		this.imgsrc_over = this.imgsrc.substr(0,dotpos) + opt.swapExt + this.imgsrc.substr(dotpos);

		// cache rollover image
		var tmpImg = new Image();
		tmpImg.src = this.imgsrc_over;
		
	}
	
	/**************
	* is Active
	*/
	jQuery.SygRolloverSwap.prototype.isActive = function(){
		return jQuery(this.target).is('.active');
	}
	
	/**************
	* rollover
	*/
	jQuery.SygRolloverSwap.prototype.rollover = function(){
		this.effectTarget.src = this.imgsrc_over;
	}
	
	/**************
	* rollout
	*/
	jQuery.SygRolloverSwap.prototype.rollout = function(){
		this.effectTarget.src = this.imgsrc;
	}

	/////////////////////////////////////////////////
	// scroll class
	/////////////////////////////////////////////////
	
	/**************
	* constructor
	*/
	jQuery.SygRolloverScroll = function( target, effectTarget, opt ){
		this.target = target;
		this.effectTarget = effectTarget;
		this.opt = opt;
	}
	
	/**************
	* is Active
	*/
	jQuery.SygRolloverScroll.prototype.isActive = function(){
		return jQuery(this.target).is('.active');
	}
	
	/**************
	* rollover
	*/
	jQuery.SygRolloverScroll.prototype.rollover = function(){
		var opt = this.opt;
		var x = opt.scrollOver[0];
		var y = opt.scrollOver[1];
		
		jQuery(this.effectTarget).stop(true,false)
		.animate( {left:x, top:y}, opt.scrollTime, opt.scrollEasing );
	}
	
	/**************
	* rollout
	*/
	jQuery.SygRolloverScroll.prototype.rollout = function(){
		var opt = this.opt;
		var x = opt.scrollOut[0];
		var y = opt.scrollOut[1];
		
		jQuery(this.effectTarget).stop(true,false)
		.animate( {left:x, top:y}, opt.scrollTime, opt.scrollEasing );
	}
	

	/////////////////////////////////////////////////
	// fade class
	/////////////////////////////////////////////////
	
	/**************
	* constructor
	*/
	jQuery.SygRolloverFade = function( target, effectTarget, opt ){
		this.target = target;
		this.effectTarget = effectTarget;
		this.opt = opt;
	}
	
	/**************
	* is Active
	*/
	jQuery.SygRolloverFade.prototype.isActive = function(){
		return jQuery(this.target).is('.active');
	}
	
	/**************
	* rollover
	*/
	jQuery.SygRolloverFade.prototype.rollover = function(){
		var opt = this.opt;
		
		jQuery(this.effectTarget).stop(true,false)
			.animate( {opacity:opt.fadeOverOpacity}, opt.fadeOverTime, 'swing' );
	}
	
	/**************
	* rollout
	*/
	jQuery.SygRolloverFade.prototype.rollout = function(){
		var opt = this.opt;
		var x = opt.scrollOut[0];
		var y = opt.scrollOut[1];
		
		jQuery(this.effectTarget).stop(true,false)
			.animate( {opacity:opt.fadeOutOpacity}, opt.fadeOutTime, 'swing' );
	}
	

	
})( jQuery );

