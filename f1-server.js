const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();
const supaUrl = 'https://lrbjrjracaaexrcdlwch.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyYmpyanJhY2FhZXhyY2Rsd2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0ODM1MTcsImV4cCI6MjAyNDA1OTUxN30.t42nh4V9AdejI61JD_8eKGPxurBuY7hbu_XFKFxsvPg';
const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/api/seasons', async (req, res) => {
    const {data, error} = await supabase
    .from('seasons')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

app.get('/api/circuits', async (req, res) => {
    const {data, error} = await supabase
    .from('circuits')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

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

app.get('/api/constructors', async (req, res) => {
    const {data, error} = await supabase
    .from('constructors')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

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

app.get('/api/drivers', async (req, res) => {
    const {data, error} = await supabase
    .from('drivers')
    .select();
    
    if (handleErrors(res, error, data)) {
        return;
    }
    
    res.send(data);
});

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

app.get('/api/results/drivers/:ref/seasons/:start/:end', async (req, res) => {
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

app.get('/api/standings/drivers/:raceId', async (req, res) => {
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

app.get('/api/standings/constructors/:raceId', async (req, res) => {
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

