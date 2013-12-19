/*****************************************

jQuery.syg_rollover
version 1.4
Hiroshi Fukuda <dada@sygnas.jp>
http://sygnas.jp/

The MIT License

Copyright (c) 2011-2012 Hiroshi Fukuda, http://sygnas.jp/

------------------------
2012.11.24 ver1.4
	オプション「toggle」を追加。アクティブなものが押されたらアクティブ解除する。


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
			select:			false,
			effectTarget:	'self',
			toggle:			false,
			
			// scroll mode options
			scrollEasing:	'swing',
			scrollTime:		200,
			scrollOut:		[0,0],
			scrollOver:		[0,-10],
			scrollSelect:	[0,-20],
			// effectTarget:	'self',		← effectTarget に統合
			
			// swap mode options
			swapExt:		'-over',
			swapSelect:		'-select',
			
			// fade mode options
			fadeOverTime:	200,
			fadeOutTime:	200,
			fadeOverOpacity:0.5,
			fadeOutOpacity:	1,
			fadeSelect:		'-select'
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
				
				if( opt.select ){
					self.select( count );
				}else{
					self.rollover( count, true );
					self.active = buttons[count];
				}
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
			
			var id = e.currentTarget.sygRolloverID;
			
			// オプション「toggle」が true の時、押されたものがアクティブなら解除
			if( opt.toggle ){
				
				if( self.buttons[id] == self.active ){
					jQuery( self.active.target ).removeClass('active');
					self.rollout( self.active.target.sygRolloverID, true );
					self.active = null;
				}else{
					self.select( id );
				}
			}else{
				self.select( id );
			}
			
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
		
		if( opt.select ){
			this.buttons[id].select();
		}else{
			this.rollover( id, true );
		}
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
	
	/*****************************
	* set rollout
	*/
	var makeFilename = function( filename, ext ){
		var dotpos = filename.lastIndexOf('.');
		return filename.substr(0,dotpos) + ext + filename.substr(dotpos);
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
		this.imgsrc_over = makeFilename( this.imgsrc, opt.swapExt );

		// cache rollover image
		var hoverImg = new Image();
		hoverImg.src = this.imgsrc_over;
		
		// select image
		if( opt.select ){
			this.imgsrc_select = makeFilename( this.imgsrc, opt.swapSelect );
			var selectImg = new Image();
			selectImg.src = this.imgsrc_select;
		}
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

	/**************
	* select
	*/
	jQuery.SygRolloverSwap.prototype.select = function(){
		this.effectTarget.src = this.imgsrc_select;
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
	
	/**************
	* select
	*/
	jQuery.SygRolloverScroll.prototype.select = function(){
		var opt = this.opt;
		var x = opt.scrollSelect[0];
		var y = opt.scrollSelect[1];
		
		jQuery(this.effectTarget).stop(true,false)
		.animate( {left:x, top:y}, 0 );
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
		
		
		this.imgsrc = effectTarget.src;
		this.imgsrc_select = makeFilename( this.imgsrc, opt.fadeSelect );
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
		
		this.effectTarget.src = this.imgsrc;
		
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
		
		this.effectTarget.src = this.imgsrc;
		
		jQuery(this.effectTarget).stop(true,false)
			.animate( {opacity:opt.fadeOutOpacity}, opt.fadeOutTime, 'swing' );
	}
	
	/**************
	* select
	*/
	jQuery.SygRolloverFade.prototype.select = function(){
		this.effectTarget.src = this.imgsrc_select;
		jQuery( this.effectTarget ).stop(true,false).css('opacity',1);
	}

	
})( jQuery );

