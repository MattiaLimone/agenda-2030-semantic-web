import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemText from '@mui/material/ListItemText';
import '../css/page.css';
import { Space8, Space12, Space16 } from "../utils/spacing";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { CardActionArea } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function SourcePage(props) {

    var sourcedata = {
        address: props.address,
        name: props.name,
        definition: props.definition,
        description: props.description,
        placedTerritories: [], // array of {name: STRING, address: STRING} DEF 1 is source name; 2 is semantic resource address
        crit_amb: [], // this and the following 4 arrays contains only strings
        crit_fin: [],
        crit_pol: [],
        crit_soc: [],
        crit_tec: [],
        thumbnail: props.image
    }

    sourcedata.crit_amb = props.criteria[0];
    sourcedata.crit_fin = props.criteria[1];
    sourcedata.crit_pol = props.criteria[2];
    sourcedata.crit_soc = props.criteria[3];
    sourcedata.crit_tec = props.criteria[4];
    sourcedata.placedTerritories = props.territories;

    const [open_ambiental, setOpen_ambiental] = React.useState(false);
    const [open_finance, setOpen_finance] = React.useState(false);
    const [open_political, setOpen_political] = React.useState(false);
    const [open_social, setOpen_social] = React.useState(false);
    const [open_technical, setOpen_technical] = React.useState(false);
    const [criteria_open, setCriteria_open] = React.useState(false);
    const [pressed_criteria, setPressed_criteria] = React.useState(null);
    const [describe_open, setDescribe_open] = React.useState(false);
    const [describe_contents, setDescribe_contents] = React.useState(null);

    const handleClick_ambiental = () => {
        setOpen_ambiental(!open_ambiental);
    };
    const handleClick_finance = () => {
        setOpen_finance(!open_finance);
    };
    const handleClick_political = () => {
        setOpen_political(!open_political);
    };
    const handleClick_social = () => {
        setOpen_social(!open_social);
    };
    const handleClick_technical = () => {
        setOpen_technical(!open_technical);
    };

    const handleCriteriaClickOpen = (criteria_address) => {
        criteria_address = criteria_address.replace('http://www.semanticweb.org/abate/ontologies/2022/4/swea#', 'swea:');
        var details = {};
        fetch("http://127.0.0.1:8080/singleCriteriaInformation?res=" + criteria_address)
            .then(res_a => res_a.json())
            .then(
                (result_a) => {
                    details.name = result_a.name;
                    details.type = result_a.type;
                    details.description = result_a.description;
                    details.link = result_a.source;

                    fetch("http://127.0.0.1:8080/singleCriteriaTerritoriesRelated?res=" + criteria_address)
                        .then(res_b => res_b.json())
                        .then(
                            (result_b) => {
                                details.territories = result_b.territories;

                                fetch("http://127.0.0.1:8080/singleCriteriaSourcesRelated?res=" + criteria_address)
                                    .then(res_c => res_c.json())
                                    .then(
                                        (result_c) => {
                                            details.sources = result_c.sources;
            
                                            fetch("http://127.0.0.1:8080/singleCriteriaEcosystemsAndDevicesAndLawsRelated?res=" + criteria_address)
                                                .then(res_d => res_d.json())
                                                .then(
                                                    (result_d) => {
                                                        details.ecosystems = result_d.ecosystems;
                                                        details.devices = result_d.devices;
                                                        details.norms = result_d.norms;
                                                        
                                                        fetch("http://127.0.0.1:8080/singleCriteriaPricesRelated?res=" + criteria_address)
                                                            .then(res_e => res_e.json())
                                                            .then(
                                                                (result_e) => {
                                                                    details.prices = result_e.prices;

                                                                    fetch("http://127.0.0.1:8080/singleCriteriaMeasuresRelated?res=" + criteria_address)
                                                                        .then(res_f => res_f.json())
                                                                        .then(
                                                                            (result_f) => {
                                                                                details.measures = result_f.measures;
                                                                                
                                                                                console.log(details);

                                                                                setPressed_criteria(details);
                                                                                setCriteria_open(true);

                                                                            },
                                                                            (error_f) => {
                                                                                console.log("Backend error");
                                                                            }
                                                                        )

                                                                },
                                                                (error_e) => {
                                                                    console.log("Backend error");
                                                                }
                                                            )

                                                    },
                                                    (error_d) => {
                                                        console.log("Backend error");
                                                    }
                                                )
            
                                        },
                                        (error_c) => {
                                            console.log("Backend error");
                                        }
                                    )

                            },
                            (error_b) => {
                                console.log("Backend error");
                            }
                        )

                },
                (error_a) => {
                    console.log("Backend error");
                }
            )
    };
  
    const handleCriteriaClose = () => {
        setCriteria_open(false);
    };

    var callback_changePage = props.changePageCallback;

    const onPressedTerritory = (chosenTerritory) => {
        for (var i = 0; i < sourcedata.placedTerritories.length; i++) {
            if (chosenTerritory == sourcedata.placedTerritories[i].name) {
                callback_changePage(1, sourcedata.placedTerritories[i].address);
                break;
            }
        }
    };

    const onPressDescribe = () => {
        var resource_link = sourcedata.address;
        fetch("http://127.0.0.1:8080//describeSource?res=" + resource_link)
            .then(res => res.json())
            .then(
                (result) => {
                    setDescribe_contents({
                        links: result.results
                    });
                    setDescribe_open(true);
                },
                (error) => {
                    console.log("Backend error");
                }
            )
    }
  
    const handleDescribeClose = () => {
        setDescribe_open(false);
    };

    return (

        <Container maxWidth="xl" className='pageContainer'>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={7}>
                            
                        <Typography variant="h3" component="div" gutterBottom>
                            {sourcedata.name}
                        </Typography>
                        <Space8/>

                        <Typography variant="h5" component="div" gutterBottom>
                            Description
                        </Typography>
                        <Typography variant="caption" component="div" gutterBottom>
                        What is a renewable source?
                        </Typography>

                        <Container maxWidth="xl" style={{marginLeft: 0}}>
                            <Typography variant="body1" component="div" gutterBottom align='justify'>
                                {sourcedata.definition}
                            </Typography>
                        </Container>
                        <Space16/>

                        <Typography variant="caption" component="div" gutterBottom>
                        About {sourcedata.name}
                        </Typography>

                        <Container maxWidth="xl" style={{marginLeft: 0}}>
                            <Typography variant="body1" component="div" gutterBottom align='justify'>
                                {sourcedata.description}
                            </Typography>
                        </Container>

                    </Grid>
                    <Grid item xs={5}>
                        
                        <Space16/> <Space16/> <Space16/> <Space16/> <Space16/>

                        {
                            (sourcedata.thumbnail == null || sourcedata.thumbnail == undefined || sourcedata.thumbnail == "" || sourcedata.thumbnail == " ")
                            ? <div></div>
                            : <Card className='image-right table-dark' sx={{ marginBottom: 2 }}>
                                <CardActionArea>
                                    <CardMedia sx={{ height: 120, objectFit: 'contain' }}
                                    component="img"
                                    image={sourcedata.thumbnail}
                                    />
                                </CardActionArea>
                            </Card>
                        }

                        <Typography variant="h5" component="div" gutterBottom>
                            Territories
                        </Typography>
                        <Typography variant="caption" component="div" gutterBottom>
                            Where you can use {sourcedata.name}
                        </Typography>

                        <Container maxWidth="sm" style={{marginLeft: 0, marginBottom: 16}}>
                            <List
                            sx={{ width: '100%' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            >
                            {
                                sourcedata.placedTerritories.length > 0 ?
                                sourcedata.placedTerritories.map(
                                    territory => {
                                        return (
                                            <ListItemButton className='listitem-dark' onClick={() => {onPressedTerritory(territory.name)}}>
                                                <ListItemText primary={territory.name} />
                                            </ListItemButton>
                                        )
                                    }
                                ) :
                                <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                    <ListItemText primary={"Empty"} />
                                </ListItemButton>
                            }
                            </List>
                        </Container>

                        <Typography variant="h5" component="div" gutterBottom>
                            Utilization Criteria
                        </Typography>
                        <Typography variant="caption" component="div" gutterBottom>
                        It's possible to use {sourcedata.name} in a territory according to the following criteria
                        </Typography>

                        <Container maxWidth="sm" style={{marginLeft: 0, marginBottom: 16}}>
                            <List
                            sx={{ width: '100%' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            >
                            <ListItemButton onClick={handleClick_ambiental} className='listitem-dark'>
                                <ListItemText primary="Ambiental Criteria" />
                                {open_ambiental ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open_ambiental} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        sourcedata.crit_amb.length > 0 ?
                                            sourcedata.crit_amb.map(
                                                crit => {
                                                    return (
                                                        <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark' onClick={() => {
                                                            handleCriteriaClickOpen(crit.criteria);
                                                        }}>
                                                            <ListItemText primary={"- " + crit.criteria_name} />
                                                        </ListItemButton>
                                                    )
                                                }
                                            )
                                        :
                                            <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                                <ListItemText primary={"Empty"} />
                                            </ListItemButton>
                                    }
                                </List>
                            </Collapse>
                            <ListItemButton onClick={handleClick_finance} className='listitem-dark'>
                                <ListItemText primary="Finance Criteria" />
                                {open_finance ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open_finance} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>{
                                    sourcedata.crit_fin.length > 0 ?
                                        sourcedata.crit_fin.map(
                                            crit => {
                                                return (
                                                    <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark' onClick={() => {
                                                        handleCriteriaClickOpen(crit.criteria);
                                                    }}>
                                                        <ListItemText primary={"- " + crit.criteria_name} />
                                                    </ListItemButton>
                                                )
                                            }
                                        )
                                    :
                                        <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                            <ListItemText primary={"Empty"} />
                                        </ListItemButton>
                                    }
                                </List>
                            </Collapse>
                            <ListItemButton onClick={handleClick_political} className='listitem-dark'>
                                <ListItemText primary="Political Criteria" />
                                {open_political ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open_political} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>{
                                    sourcedata.crit_pol.length > 0 ?
                                        sourcedata.crit_pol.map(
                                            crit => {
                                                return (
                                                    <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark' onClick={() => {
                                                        handleCriteriaClickOpen(crit.criteria);
                                                    }}>
                                                        <ListItemText primary={"- " + crit.criteria_name} />
                                                    </ListItemButton>
                                                )
                                            }
                                        )
                                    :
                                        <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                            <ListItemText primary={"Empty"} />
                                        </ListItemButton>
                                    }
                                </List>
                            </Collapse>
                            <ListItemButton onClick={handleClick_social} className='listitem-dark'>
                                <ListItemText primary="Social Criteria" />
                                {open_social ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open_social} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        sourcedata.crit_soc.length > 0 ?
                                            sourcedata.crit_soc.map(
                                                crit => {
                                                    return (
                                                        <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark' onClick={() => {
                                                            handleCriteriaClickOpen(crit.criteria);
                                                        }}>
                                                            <ListItemText primary={"- " + crit.criteria_name} />
                                                        </ListItemButton>
                                                    )
                                                }
                                            )
                                        :
                                            <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                                <ListItemText primary={"Empty"} />
                                            </ListItemButton>
                                    }
                                </List>
                            </Collapse>
                            <ListItemButton onClick={handleClick_technical} className='listitem-dark'>
                                <ListItemText primary="Technical Criteria" />
                                {open_technical ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open_technical} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>{
                                    sourcedata.crit_tec.length > 0 ?
                                        sourcedata.crit_tec.map(
                                            crit => {
                                                return (
                                                    <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark' onClick={() => {
                                                        handleCriteriaClickOpen(crit.criteria);
                                                    }}>
                                                        <ListItemText primary={"- " + crit.criteria_name} />
                                                    </ListItemButton>
                                                )
                                            }
                                        )
                                    :
                                        <ListItemButton sx={{ pl: 4 }} className='sublistitem-dark'>
                                            <ListItemText primary={"Empty"} />
                                        </ListItemButton>
                                    }
                                </List>
                            </Collapse>
                            </List>
                        </Container>
                        {
                            (pressed_criteria != null) ?
                                <Dialog
                                    fullScreen
                                    open={criteria_open}
                                    onClose={handleCriteriaClose}
                                    className="table-softwhite"
                                >
                                    <AppBar sx={{ position: 'relative', backgroundColor: "#2e323b"}}>
                                        <Toolbar>
                                            <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={handleCriteriaClose}
                                            aria-label="close"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                                {pressed_criteria.type} criteria: {pressed_criteria.name}
                                            </Typography>
                                        </Toolbar>
                                    </AppBar>
                                    <List className="table-softwhite">
                                        <ListItem>
                                            <ListItemText primary="Description" secondary={pressed_criteria.description} />
                                        </ListItem>
                                        <Divider />
                                        <ListItem button onClick={() => {
                                            window.open(pressed_criteria.link);
                                        }}>
                                            <ListItemText primary="About this criteria" secondary={pressed_criteria.link} />
                                        </ListItem>
                                        <Divider />
                                    </List>

                                    <Typography className="table-softwhite" variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                        Related devices
                                    </Typography>

                                    <List className="table-softwhite">
                                        {

                                            pressed_criteria.devices.length > 0 ?
                                            pressed_criteria.devices.map(
                                                device => {
                                                    return (
                                                        <div>
                                                            <ListItem button onClick={() => {
                                                                window.open(device.individual);
                                                            }}>
                                                                <ListItemText secondary={device.individual} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                    <Typography className="table-softwhite" variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                        Related norms
                                    </Typography>

                                    <List className="table-softwhite">
                                        {

                                            pressed_criteria.norms.length > 0 ?
                                            pressed_criteria.norms.map(
                                                norm => {
                                                    return (
                                                        <div>
                                                            <ListItem button onClick={() => {
                                                                window.open(norm.individual);
                                                            }}>
                                                                <ListItemText secondary={norm.individual} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                    <Typography className="table-softwhite" variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                        Related ecosystems
                                    </Typography>

                                    <List className="table-softwhite">
                                        {

                                            pressed_criteria.ecosystems.length > 0 ?
                                            pressed_criteria.ecosystems.map(
                                                eco => {
                                                    return (
                                                        <div>
                                                            <ListItem button onClick={() => {
                                                                window.open(eco.individual);
                                                            }}>
                                                                <ListItemText secondary={eco.individual} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                    <Typography className="table-softwhite" variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                        Related measures
                                    </Typography>

                                    <List className="table-softwhite">
                                        {

                                            pressed_criteria.measures.length > 0 ?
                                            pressed_criteria.measures.map(
                                                measure => {
                                                    return (
                                                        <div>
                                                            <ListItem>
                                                                <ListItemText primary={measure.value + " " + measure.unit} secondary={measure.description} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                    <Typography className="table-softwhite" variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                        Related prices
                                    </Typography>

                                    <List className="table-softwhite">
                                        {

                                            pressed_criteria.prices.length > 0 ?
                                            pressed_criteria.prices.map(
                                                price => {
                                                    return (
                                                        <div>
                                                            <ListItem>
                                                                <ListItemText primary={price.value + " " + price.currency} secondary={price.description} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                    <Box sx={{ flexGrow: 1 }} className="table-softwhite">
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>

                                                <Typography variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                                    Related sources
                                                </Typography>

                                                <List>
                                                    {

                                                        pressed_criteria.sources.length > 0 ?
                                                        pressed_criteria.sources.map(
                                                            source => {
                                                                return (
                                                                    <div>
                                                                        <ListItem>
                                                                            <ListItemText secondary={source} />
                                                                        </ListItem>
                                                                        <Divider />
                                                                    </div>
                                                                )
                                                            }
                                                        ) :
                                                        <div>
                                                            <ListItem>
                                                                <ListItemText secondary="Empty" />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    }
                                                </List>

                                            </Grid>
                                            <Grid item xs={6}>

                                                <Typography variant="body1" component="div" gutterBottom sx={{paddingLeft: 2, paddingTop: 1.5, marginBottom: -0.5, paddingBottom: 0, fontWeight: 700}}>
                                                    Related territories
                                                </Typography>

                                                <List >
                                                    {

                                                        pressed_criteria.territories.length > 0 ?
                                                        pressed_criteria.territories.map(
                                                            territory => {
                                                                return (
                                                                    <div>
                                                                        <ListItem >
                                                                            <ListItemText secondary={territory} />
                                                                        </ListItem>
                                                                        <Divider />
                                                                    </div>
                                                                )
                                                            }
                                                        ) :
                                                        <div>
                                                            <ListItem>
                                                                <ListItemText secondary="Empty" />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    }
                                                </List>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                </Dialog>
                            : <div></div>
                        }
                        
                        <Typography variant="h5" component="div" gutterBottom>
                            Describe resource
                        </Typography>
                        <Typography variant="caption" component="div" gutterBottom>
                            Search for {sourcedata.name} related resources
                        </Typography>
                        <Container maxWidth="sm" style={{marginLeft: 0, marginBottom: 16}}>
                            <Button variant="outlined" size="large" sx={{ width: '100%', borderColor: "#FFFFFF", color: "#FFFFFF" }} onClick={onPressDescribe}>Describe energy source</Button>
                        </Container>
                        {
                            (describe_contents != null) ?
                                <Dialog
                                    fullScreen
                                    open={describe_open}
                                    onClose={handleDescribeClose}
                                    className="table-softwhite"
                                >
                                    <AppBar sx={{ position: 'relative', backgroundColor: "#2e323b"}}>
                                        <Toolbar>
                                            <IconButton
                                            edge="start"
                                            color="inherit"
                                            onClick={handleDescribeClose}
                                            aria-label="close"
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                                                Describing {sourcedata.name}
                                            </Typography>
                                        </Toolbar>
                                    </AppBar>

                                    <List className="table-softwhite">
                                        {

                                            describe_contents.links.length > 0 ?
                                            describe_contents.links.map(
                                                link => {
                                                    return (
                                                        <div>
                                                            <ListItem button onClick={() => {
                                                                window.open(link);
                                                            }}>
                                                                <ListItemText secondary={link} />
                                                            </ListItem>
                                                            <Divider />
                                                        </div>

                                                    )
                                                }
                                            ) :
                                            <div>
                                                <ListItem>
                                                    <ListItemText secondary="Empty" />
                                                </ListItem>
                                                <Divider />
                                            </div>

                                        }
                                    </List>

                                </Dialog>
                            : <div></div>
                        }

                    </Grid>
                </Grid>
            </Box>

            <Fab className="fab-back" color="red" aria-label="add" onClick={goBack}>
                <ArrowBackIcon/>
            </Fab>

        </Container>

    );

    function goBack() {
        callback_changePage(0, '');
    }

}
