

const CovidData = ({data}) => {

    return ( 
        <>
            <p className="population">Population:
                <br/>
                <span id="population">{data.population}</span>
            </p>

            <p className="infected">Infected:
                <br/>
                <span id="confirmed">{data.confirmed}</span>
            </p>

            {
            data.recovered ? 
            <p className="recovered">Recovered:
                <br/>
                <span id="recovered_daily">{data.recovered}</span>
            </p>   
            : null
            } 

            <p className="deaths">Deaths:
                <br/>
                <span id="deaths">{data.deaths}</span>
            </p>

            <p className="infected">Daily infected:
                <br/>
                <span id="confirmed_daily">{data.confirmed_daily}</span>
            </p>

            {
            data.recovered_daily ? 
            <p className="recovered">Daily recovered:
                <br/>
                <span id="recovered_daily">{data.recovered_daily}</span>
            </p>   
            : null
            } 

            <p className="deaths">Daily deaths:
                <br/>
                <span id="deaths_daily">{data.deaths_daily}</span>
            </p> 
        </>
     );
}
 
export default CovidData;