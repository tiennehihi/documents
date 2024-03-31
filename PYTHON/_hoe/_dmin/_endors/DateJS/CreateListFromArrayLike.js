/* Ion.RangeSlider, Nice Skin
// css version 2.0.3
// © Denis Ineshin, 2014    https://github.com/IonDen
// ===================================================================================================================*/

/* =====================================================================================================================
// Skin details */

.irs-line-mid,
.irs-line-left,
.irs-line-right,
.irs-bar,
.irs-bar-edge,
.irs-slider {
    background: url(../img/sprite-skin-nice.png) repeat-x;
}

.irs {
    height: 40px;
}
.irs-with-grid {
    height: 60px;
}
.irs-line {
    height: 8px; top: 25px;
}
    .irs-line-left {
        height: 8px;
        background-position: 0 -30px;
    }
    .irs-line-mid {
        height: 8px;
        background-position: 0 0;
    }
    .irs-line-right {
        height: 8px;
        background-position: 100% -30px;
    }

.irs-bar {
    height: 8px; top: 25px;
    background-position: 0 -60px;
}
    .irs-bar-edge {
        top: 25px;
        height: 8px; width: 11px;
        background-position: 0 -90px;
    }

.irs-shadow {
    height: 1px; top: 34px;
    background: #000;
    opacity: 0.15;
}
.lt-ie9 .irs-shadow {
    filter: alpha(opacity=15);
}

.irs-slider {
    width: 22px; height: 22px;
    top: 17px;
    background-position: 0 -120px;
}
.irs-slider.state_hover, .irs-slider:hover {
    background-position: 0 -150px;
}

.