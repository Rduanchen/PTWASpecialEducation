export default class Timer {
    constructor(){
        this.Time = 0
        this.TotalTime = 0
        this.FinalStopTime = 0
        this.Interval = null
    }
    Start(){
        if(this.Interval){
            return
        }
        this.Interval = setInterval(()=>{
            this.Time++;
            this.TotalTime++;
        },1000)
    }
    Pause(){
        clearInterval(this.Interval);
        this.Interval = null;
        this.FinalStopTime = this.Time;
    }
    Reset(){
        this.Pause();
        this.Time = 0;
    }
    PureReset(){
        this.Pause();
        this.Time = 0;
        this.TotalTime = 0;
        this.FinalStopTime = 0;
    }
    GetTime(){
        return this.Time
    }
    GetTotalTime(){
        return this.TotalTime
    }
    GetFinalStopTime(){
        return this.FinalStopTime
    }
}