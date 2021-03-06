(function($) {
	function find(expr, container) {
		if (!container || expr.indexOf('#') > -1)
			container = document;
		var i = expr.indexOf('@');
		if (i == 0)
			return $(container);
		else if (i > 0)
			expr = expr.substring(0, i);
		return (expr == 'this') ? $(container) : $(expr, container);
	}
	function val(expr, container, val) {// expr #id #id@attr .class@attr
		// @attr
		if (!container || expr.indexOf('#') > -1)
			container = document;
		if (!expr)
			return;
		if (arguments.length > 2) {
			var i = expr.indexOf('@');
			if (i < 0) {
				var ele = expr == 'this' ? $(container) : $(expr, container);
				ele.each(function() {
							var t = $(this);
							if (t.is(':input')) {
								t.val(val).trigger('change')
										.trigger('validate');
							} else {
								if (val === null && !t.is('td'))
									t
											.html('<i class="glyphicon glyphicon-list"></i>');
								else
									t.text(val);
							}
						});
			} else if (i == 0) {
				$(container).attr(expr.substring(i + 1), val);
			} else {
				var selector = expr.substring(0, i);
				var ele = selector == 'this' ? $(container) : $(selector,
						container);
				if (ele.parents('.richtable').length
						&& ele.prop('tagName') == 'TD'
						&& expr.indexOf('data-cellvalue') > -1)
					Richtable.updateValue(ele, val);
				else
					ele.attr(expr.substring(i + 1), val);
			}
		} else {
			var i = expr.indexOf('@');
			if (i < 0) {
				var ele = expr == 'this' ? $(container) : $(expr, container);
				if (ele.is(':input'))
					return ele.val();
				else
					return ele.contents().filter(function() {
								return this.nodeType == 3;
							}).text();
			} else if (i == 0) {
				return $(container).attr(expr.substring(i + 1));
			} else {
				var selector = expr.substring(0, i);
				var ele = selector == 'this' ? $(container) : $(selector,
						container);
				return ele.attr(expr.substring(i + 1));
			}
		}
	}
	function removeAction(event) {
		var current = $(event.target).closest('.treeselect');
		var options = current.data('_options');
		var viewlink = current.find('a.view[rel="richtable"]');
		if (current.is('td') && viewlink.length)
			viewlink.text(null);
		else
			val(options.name, current, null);
		val(options.id, current, null);
		if (options.id) {
			var idtarget = find(options.id);
			idtarget.removeData('treenode');
		}
		$(this).remove();
		event.stopPropagation();
		return false;

	}
	$.fn.treeselect = function() {
		$(this).each(function() {
			var current = $(this);
			var options = {
				idproperty : 'id',
				separator : '',
				id : '.treeselect-id',
				name : '.treeselect-name',
				full : true
			}
			$.extend(options, (new Function("return "
							+ (current.data('options') || '{}')))());
			current.data('_options', options);
			var nametarget = null;
			if (options.name) {
				nametarget = find(options.name, current);
				var remove = nametarget.children('a.remove');
				if (remove.length) {
					remove.click(removeAction);
				} else {
					var text = val(options.name, current);
					var viewlink = current.find('a.view[rel="richtable"]');
					if (current.is('td') && viewlink.length)
						text = viewlink.text();
					if (text) {
						if (text.indexOf('...') < 0)
							$('<a class="remove" href="#">&times;</a>')
									.appendTo(nametarget).click(removeAction);
					} else {
						val(options.name, current, null);
					}
				}
			}
			var func = function(event) {
				if ($(event.target).is('a.view[rel="richtable"]'))
					return true;
				var current = $(event.target).closest('.treeselect');
				var winid = '_tree_window';
				current.data('winid', winid);
				$('#' + winid).remove();
				var win = $('<div id="' + winid + '" title="'
						+ MessageBundle.get('select')
						+ '"><div class="tree"></div></div>')
						.appendTo(document.body);
				win.dialog({
							width : current.data('_options').width || 500,
							minHeight : current.data('_options').minHeight
									|| 500,
							close : function() {
								win.html('').dialog('destroy').remove();
							}
						});
				win.closest('.ui-dialog').css('z-index', 2500);
				if (nametarget && nametarget.length)
					options.value = val(options.name, current) || '';
				if (options.multiple) {
					var treeviewoptions = {
						url : options.url,
						collapsed : true,
						template : '<input type="checkbox" class="custom" value="{{id}}"/> <span>{{name}}</span>',
						placeholder : MessageBundle.get('ajax.loading'),
						unique : true,
						separator : options.separator,
						root : options.root
					};
					win.find('.tree').data('selected',
							val(options.id, current) || '')
							.treeview(treeviewoptions);
					$('<div style="text-align:center;"><button class="btn btn-primary pick">'
							+ MessageBundle.get('confirm') + '</button></div>')
							.appendTo(win).click(function() {
								var ids = [], names = [];
								$('input:checked', win).each(function() {
									ids.push(this.value);
									names.push($(this).closest('li')
											.children('span').text());
								});
								if (options.name) {
									var separator = ', ';
									var nametarget = find(options.name, current);
									nametarget.each(function() {
										var t = $(this);
										val(options.name, current, names
														.join(separator));
										if (!t.is(':input')) {
											if (!t.find('.remove').length)
												$('<a class="remove" href="#">&times;</a>')
														.appendTo(t)
														.click(removeAction);
											if (!names.length)
												t.find('.remove').click();
										}
									});
								}
								if (options.id) {
									var separator = ',';
									val(options.id, current, ids
													.join(separator));
								}
								win.dialog('close');
							});

				} else {
					if (options.type == 'treearea') {
						options.click = function(treenode) {
							doclick(current, treenode, options);
						};
						win.find('.tree').treearea(options);
					} else {
						var treeviewoptions = {
							url : options.url,
							click : function() {
								var treenode = $(this).closest('li')
										.data('treenode');
								doclick(current, treenode, options);
							},
							collapsed : true,
							placeholder : MessageBundle.get('ajax.loading'),
							unique : true,
							separator : options.separator,
							value : options.value,
							root : options.root
						};
						win.find('.tree').treeview(treeviewoptions);
					}
				}

			};
			var handle = current.find('.treeselect-handle');
			if (!handle.length)
				handle = current;
			handle.css('cursor', 'pointer').click(func).keydown(
					function(event) {
						if (event.keyCode == 13) {
							func(event);
							return false;
						}
					});
		});
		return this;
	};

	function doclick(current, treenode, options) {
		if (options.name) {
			var nametarget = find(options.name, current);
			var name = options.full ? treenode.fullname : treenode.name;
			nametarget.each(function() {
						var viewlink = nametarget
								.find('a.view[rel="richtable"]');
						if (nametarget.is('td') && viewlink.length) {
							var href = viewlink.attr('href');
							viewlink.attr('href', href.substring(0, href
													.lastIndexOf('/')
													+ 1)
											+ treenode.id);
							viewlink.text(name);
							if (!viewlink.next('.remove').length)
								$('<a class="remove" href="#">&times;</a>')
										.insertAfter(viewlink).click(removeAction);
						} else {
							val(options.name, current, name);
							var t = $(this);
							if (!t.is(':input'))
								$('<a class="remove" href="#">&times;</a>')
										.appendTo(t).click(removeAction);
						}
					});
		}
		if (options.id) {
			var idtarget = find(options.id, current);
			var id = treenode[options.idproperty];
			val(options.id, current, id);
			if (idtarget.is(':input'))
				idtarget.data('treenode', treenode);
		}
		$('#' + current.data('winid')).dialog('close');
		if (options.select)
			options.select(treenode);
	}

})(jQuery);

Observation.treeselect = function(container) {
	$$('.treeselect', container).treeselect();
	if ($(container).is('li')) {
		var t = $(container);
		var selected = t.closest('.tree').data('selected');
		if (selected) {
			var arr = selected.split(',');
			$('input[type="checkbox"]', t).each(function() {
						if ($.inArray(this.value, arr) > -1)
							$(this).click();
					});
		}
	}
};