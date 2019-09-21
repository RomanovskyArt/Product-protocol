var ringer = {
    //countdown_to: "10/31/2014",
    countdown_to: "10/4/2019",
    rings: {
        'Days': {
            s: 86400000, // mseconds in a day,
            max: 365
        },
        'Hours': {
            s: 3600000, // mseconds per hour,
            max: 24
        },
        'Minutes': {
            s: 60000, // mseconds per minute
            max: 60
        },
        'Seconds': {
            s: 1000,
            max: 60
        }//,
        // 'Microsec': {
        //   s: 10,
        //   max: 100
        // }
    },
    r_count: 4,
    r_spacing: 10, // px
    r_size: 100, // px
    r_thickness: 3, // px
    r_pointThickness: 7, // px
    update_interval: 11, // ms

    init: function()
    {
        $r = ringer;
        $r.cvs = document.createElement("canvas");

        //get DPI
        let dpi = window.devicePixelRatio;

        $r.size = {
            w: ((($r.r_size + $r.r_pointThickness) * $r.r_count + ($r.r_spacing*($r.r_count-1))) * dpi),
            h: (($r.r_size + $r.r_pointThickness) * dpi)
        };


        $r.cvs.setAttribute('width',$r.size.w);
        $r.cvs.setAttribute('height',$r.size.h);
        $r.ctx = $r.cvs.getContext('2d');

        var element = document.getElementById("countdown");
        $(element).append($r.cvs);
        $r.cvs = $($r.cvs);
        $r.ctx.textAlign = 'center';
        $r.actual_size = $r.r_size + $r.r_pointThickness;
        $r.countdown_to_time = new Date($r.countdown_to).getTime();
        $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });

        // Making shapes rounded
        $r.ctx.lineCap = 'round';

        $r.go();
    },
    ctx: null,
    go: function()
    {
        var idx=0;

        $r.time = (new Date().getTime()) - $r.countdown_to_time;


        for(let r_key in $r.rings)
            $r.unit(idx++, r_key, $r.rings[r_key]);

        setTimeout($r.go,$r.update_interval);
    },
    unit: function(idx,label,ring) {
        var x,y, value, ring_secs = ring.s;
        value = parseFloat($r.time/ring_secs);
        $r.time-=Math.round(parseInt(value)) * ring_secs;
        value = Math.abs(value);

        x = ($r.r_size*.5 + $r.r_pointThickness*.5);
        x +=+(idx*($r.r_size+$r.r_spacing+$r.r_pointThickness));
        y = $r.r_size*.5;
        y += $r.r_pointThickness*.5;


        // calculate arc end angle
        var degrees = 360-(value / ring.max) * 360.0;
        var endAngle = degrees * (Math.PI / 180);
        var pointAngleStart = degrees;
        var pointAngleEnd = (degrees + 10)* Math.PI;

        $r.ctx.save();

        $r.ctx.translate(x,y);
        $r.ctx.clearRect($r.actual_size*-0.5,$r.actual_size*-0.5,$r.actual_size,$r.actual_size);

        // first circle
        $r.ctx.strokeStyle = "rgba(0, 69, 180, 1)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,110,2 * Math.PI + 110, 2);
        $r.ctx.lineWidth = $r.r_thickness;
        $r.ctx.stroke();

        // second circle
        $r.ctx.strokeStyle = "rgba(0, 188, 202, 1)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,110,endAngle + 110, 1);
        $r.ctx.lineWidth = $r.r_thickness;
        $r.ctx.stroke();

        // Circle end point
        $r.ctx.strokeStyle = "rgba(0, 69, 180, 1)";
        $r.ctx.beginPath();
        $r.ctx.lineWidth = $r.r_pointThickness;
        $r.ctx.arc(0,0,$r.r_size/2, endAngle + 110, endAngle + 110, 1);
        $r.ctx.stroke();

        // label
        $r.ctx.fillStyle = "#454545";

        $r.ctx.font = '12px Helvetica';
        $r.ctx.fillText(label, 0, 23);
        $r.ctx.fillText(label, 0, 23);

        $r.ctx.font = 'bold 40px Helvetica';
        $r.ctx.fillText(Math.floor(value), 0, 10);

        $r.ctx.restore();
    }
}

ringer.init();