/*
 Author:
 Cameron Hill
 
 Description:
 
 This Express application provides a RESTful API to interact with a Supabase
 database containing information related to f1 motorsports. This information
 includes seasons, circuits, constructors, drivers, races, results, qualifying,
 driver standings, and constructor standings.
 
 */

const express = require('express');
const supa = require('@supabase/supabase-js');
const cors = require('cors');
const app = express();
const supaUrl = 'https://lrbjrjracaaexrcdlwch.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmpyanJhY2FhZXhyY2Rsd2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0ODM1MTcsImV4cCI6MjAyNDA1OTUxN30.t42nh4V9AdejI61JD_8eKGPxurBuY7hbu_XFKFxsvPg';
const supabase = supa.createClient(supaUrl, supaAnonKey);

// Then pass them to cors:
app.use(cors());

/*
 Below are the different api routes
 */
// all the seasons

app.get('/api/seasons', async (req, res) => {
    const {data, error} = await supabase
    .from('seasons')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all the circuits

app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//just the specified circuit
//input - circuitRef - character insensitive

app.get('/api/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select()
    .ilike('circuitRef', req.params.ref);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the circuits used in a given season
//input - year

app.get('/api/circuits/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`year, round, circuits (*)`)
    .eq('year', req.params.year)
    .order('round', { ascending: true });
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all the constructors

app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//just the specified constructor
//input - constructorRef - character insensitive

app.get('/api/constructors/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select()
    .ilike('constructorRef', req.params.ref);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the constructors within a given season
//input - year
//REMOVED FROM ASSIGNMENT
/*
app.get('/api/constructors/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`year, qualifying(constructors(*))`)
    .eq('year', req.params.year)
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});
*/
//all the drivers

app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//just the specified driver
//input - driverRef - character insensitive

app.get('/api/drivers/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select()
    .ilike('driverRef', req.params.ref);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the drivers whose surname begins with the substring
//input - surname - character insensitive

app.get('/api/drivers/search/:substring', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select()
    .ilike('surname', req.params.substring + '%');
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the drivers within a given season
//input - year
//REMOVED FROM ASSIGNMENT
/*
app.get('/api/drivers/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`year, qualifying(drivers(*))`)
    .eq('year', req.params.year);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});
*/
//the drivers within a given race
//input - raceId

app.get('/api/drivers/race/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('qualifying')
    .select(`raceId, drivers (*)`)
    .eq('raceId', req.params.raceId);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the specified race
//input - raceId

app.get('/api/races/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(` raceId, year, round, circuits (name, location), name, date, time, url, fp1_date, fp1_time, fp2_date, fp2_time, fp3_date, fp3_time, quali_date, quali_time, sprint_date, sprint_time`)
    .eq('raceId', req.params.raceId);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the races within a given season ordered by round
//input - year

app.get('/api/races/season/:year', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select()
    .eq('year', req.params.year)
    .order('round', { ascending: true });
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//a race specified by the round within a given season
//input - year, round

app.get('/api/races/season/:year/:round', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select()
    .eq('year', req.params.year)
    .eq('round', req.params.round)
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all races for a given circuit
//input - ciruitRef - character insensitive

app.get('/api/races/circuits/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('races')
    .select(`*, circuits!inner (circuitRef)`)
    .ilike('circuits.circuitRef', req.params.ref)
    .order('year', { ascending: true });
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all the races for a given circuit between two years
//input - ciruitRef, start 'year', end 'year'

app.get('/api/races/circuits/:ref/season/:start/:end', async (req, res) => {
    if (yearError(req.params.start, req.params.end, res)){
        return
    }
    
    const {data, error} = await supabase
    .from('races')
    .select(`*, circuits!inner (circuitRef)`)
    .ilike('circuits.circuitRef', req.params.ref)
    .gte('year', req.params.start)
    .lte('year', req.params.end)
    .order('year', { ascending: true });
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//results for the specified race
//input - raceId

app.get('/api/results/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select(`resultId, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality), number, grid, position, positionText, positionOrder, points, laps, time, milliseconds, fastestLap, rank, fastestLapTime, fastestLapSpeed, statusId`)
    .eq('raceId', req.params.raceId)
    .order('grid', { ascending: true});
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all results for a given driver
//input - driverRef

app.get('/api/results/driver/:ref', async (req, res) => {
    const {data, error} = await supabase
    .from('results')
    .select(`*, drivers!inner (driverRef)`)
    .ilike('drivers.driverRef', req.params.ref);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//all results for a given driver between two years
//input - driverRef, start 'year', end 'year'

app.get('/api/results/driver/:ref/seasons/:start/:end', async (req, res) => {
    if (yearError(req.params.start, req.params.end, res)){
        return
    }
    
    const {data, error} = await supabase
    .from('results')
    .select(`*, drivers!inner (driverRef), races!inner (year)`)
    .ilike('drivers.driverRef', req.params.ref)
    .gte('races.year', req.params.start)
    .lte('races.year', req.params.end);
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//qualifying results for the specified race
//input - raceId

app.get('/api/qualifying/:raceId', async (req, res) => {
    const {data, error} = await supabase
    .from('qualifying')
    .select(`qualifyId, drivers (driverRef, code, forename, surname), races (name, round, year, date), constructors (name, constructorRef, nationality), number, position, q1, q2, q3`)
    .eq('raceId', req.params.raceId)
    .order('position', { ascending: true});
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the current season driver standings table for the specified race sorted by
//position
//input - raceId

app.get('/api/standings/:raceId/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('driverStandings')
    .select(`driverStandingsId, raceId, drivers (driverRef, code, forename, surname), points, position, positionText, wins`)
    .eq('raceId', req.params.raceId)
    .order('position', { ascending: true});
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//the current season contructors standings table for the specified race sorted by
//position
//input - raceId

app.get('/api/standings/:raceId/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructorStandings')
    .select(`constructorStandingsId, raceId, constructors (name, constructorRef, nationality), points, position, positionText, wins`)
    .eq('raceId', req.params.raceId)
    .order('position', { ascending: true});
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

//function to do the error handling for each api

const handleErrors = (res, error, data) => {
    if (error) {
        res.status(500).json({ error: 'invalid request' });
        return true;
    }
    if (!data || data.length === 0) {
        res.status(404).json({ message: 'No Data Found' });
        return true;
    }
    return false;
};

//function that detects the error when the end year is less than the start year
//for the api's that use start and end years

const yearError = (start, end, res) => {
    if (start>end) {
        res.status(500).json({ error: 'Invalid Route, the end year is earlier than the start year' });
        return true;
    }
    return false;
};

app.listen(8080, () => {
    console.log('listening on port 8080');
});

