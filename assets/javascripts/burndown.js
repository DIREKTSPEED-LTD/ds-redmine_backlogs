if (RB == null) { var RB = {}; }
if (RB.burndown == null) { RB.burndown = {options: {}, charts: {}}; }

RB.burndown.options.disabled_series = function(new_value) {
  if (new_value == undefined) {
    var v = RB.UserPreferences.get('disabled_burndown_series');
    if (!v || v.indexOf(',') == -1) { v = ''; }
    return v.split(',');
  } else {
    RB.UserPreferences.set('disabled_burndown_series', new_value.join(','));
  }
}
RB.burndown.options.show_legend = function() {
  var legend = RB.UserPreferences.get('burndown_show_legend');
  if (!legend) { return 'sw'; }
  return legend;
}

RB.burndown.initialize = function() {
  for (id in RB.burndown.charts) {
    chart = RB.burndown.charts[id];
    if (!chart.chart) {
      $('#burndown_' + id).empty();
      chart.chart = $.jqplot('burndown_' + id, chart.series, chart.options);
    }
  }

  RB.burndown.redraw();
}

RB.burndown.redraw = function() {
  var disabled = RB.burndown.options.disabled_series();
  var legend = RB.burndown.options.show_legend();

  for (id in RB.burndown.charts) {
    chart = RB.burndown.charts[id];
    if (!chart.chart) { continue; }

    for (name in chart.position) {
      pos = chart.position[name];
      chart.chart.series[pos].show = (disabled.indexOf(name) == -1);
    }

    if (legend == 'off') {
      chart.chart.legend.show = false;
    } else {
      chart.chart.legend.show = (chart.mode == 'full');
      chart.chart.legend.location = legend;
    }

    chart.chart.replot();
  }
}

RB.burndown.change_legend = function(rb) {
  RB.UserPreferences.set('burndown_show_legend', rb.value);
  RB.burndown.redraw();
}

RB.burndown.change_series = function(cb) {
  var disabled = RB.burndown.options.disabled_series();

  i = disabled.indexOf(cb.value);
  if (i != -1) { disabled.splice(i, 1); }
  if (!cb.checked) { disabled.push(cb.value); }
  RB.burndown.options.disabled_series(disabled);
  RB.burndown.redraw();
}

RB.burndown.configure = function() {
  var disabled = RB.burndown.options.disabled_series();
  var cb;

  for (i in disabled) {
    cb = $('#burndown_series_' + disabled[i]);
    if (cb) { cb.attr('checked', false); }
  }

  var legend = RB.burndown.options.show_legend();
  $('#burndown_legend_' + legend).attr('checked', true);
}