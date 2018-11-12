import {h, Component} from 'preact';
import { route } from 'preact-router';
import uuidv4 from 'uuid/v4';

import Socket from "../modules/socket";
import {getIsoCodes} from '../utils/Strings';

export default class Create extends Component {
    /**
     * Constructor
     */
    constructor() {
        super();

        this.state = {
            servers: Socket.data.servers,
            matches: Socket.data.matches,
            groups: Socket.data.groups,
            configs: Socket.data.configs,
            map: ""
        };

        this.fields = {
            team1: {
                name: null,
                country: null
            },
            team2: {
                name: null,
                country: null
            },
            match_group: null,
            server: null,
            map: null,
            main_config: null,
            knife_config: null
        };
    }

    /**
     * Runs then component mounts
     */
    componentDidMount() {
        document.title = `Create new match | ${window.expressConfig.appName} ${window.expressConfig.env}`;
        window.events.emit('breadcrumbs', [
            {
                "name": "Home",
                "url": "/"
            },
            {
                "name": "Match",
                "url": "/"
            },
            {
                "name": "Create",
                "url": false
            }
        ]);

        Socket.on("update", (data) => this.onUpdate(data));
    }

    /**
     * Runs before component unmounts
     */
    componentWillUnmount() {
        Socket.off("update", (data) => this.onUpdate(data));
    }

    /**
     * Updates the state based on data from the socket
     *
     * @param data
     */
    onUpdate(data) {
        this.setState({
            servers: data.servers,
            matches: data.matches,
            configs: data.configs,
            groups: data.groups
        });
    }

    /**
     * Updated the map based on the selected server
     */
    updateMapField() {
        for(let item = 0; item < this.state.servers.length; item++) {
            if(this.fields.server.value === (this.state.servers[item].ip + ":" + this.state.servers[item].port)) {
                this.setState({
                    map: this.state.servers[item].default_map
                });

                break;
            }
        }
    }

    /**
     * Check's the fields and creates the match
     */
    createMatch() {
        if(!this.checkFields()) {
            Socket.send("match_create", {
                id: uuidv4(),
                team1: {
                    name: this.fields.team1.name.value,
                    country: this.fields.team1.country.value
                },
                team2: {
                    name: this.fields.team2.name.value,
                    country: this.fields.team2.country.value
                },
                match_group: this.fields.match_group.value,
                map: this.fields.map.value,
                knife_config: this.fields.knife_config.value,
                match_config: this.fields.main_config.value,
                server: this.fields.server.value,
                status: 0
            });

            this.fields.team1.name.value = "";
            this.fields.team1.country.selectedIndex = 0;
            this.fields.team2.name.value = "";
            this.fields.team2.country.selectedIndex = 0;
            this.fields.match_group.selectedIndex = 0;
            this.fields.server.selectedIndex = 0;
            this.fields.map.value = "";
            this.fields.knife_config.selectedIndex = 0;
            this.fields.main_config.selectedIndex = 0;

            window.events.emit("notification", {
                title: "Match created!",
                color: "success"
            });

            route('/');
        }
    }

    /**
     * Checks if all fields are correct
     *
     * @return {boolean}
     */
    checkFields() {
        let errors = false;

        // Reset checks
        this.fields.team1.name.classList.remove("error");
        this.fields.team1.country.classList.remove("error");
        this.fields.team2.name.classList.remove("error");
        this.fields.team2.country.classList.remove("error");
        this.fields.match_group.classList.remove("error");
        this.fields.server.classList.remove("error");
        this.fields.map.classList.remove("error");
        this.fields.knife_config.classList.remove("error");
        this.fields.main_config.classList.remove("error");

        if(this.fields.team1.name.value === "") {
            errors = true;
            this.fields.team1.name.classList.add("error");
        }
        if(this.fields.team1.country.value === "false" || this.fields.team1.country.value === false) {
            errors = true;
            this.fields.team1.country.classList.add("error");
        }
        if(this.fields.team2.name.value === "") {
            errors = true;
            this.fields.team2.name.classList.add("error");
        }
        if(this.fields.team2.country.value === "false" || this.fields.team2.country.value === false) {
            errors = true;
            this.fields.team2.country.classList.add("error");
        }
        if(this.fields.match_group.value === "false" || this.fields.match_group.value === false) {
            errors = true;
            this.fields.match_group.classList.add("error");
        }
        if(this.fields.server.value === "false" || this.fields.server.value === false) {
            errors = true;
            this.fields.server.classList.add("error");
        }
        if(this.fields.map.value === "") {
            errors = true;
            this.fields.map.classList.add("error");
        }
        if(this.fields.knife_config.value === "false" || this.fields.knife_config.value === false) {
            errors = true;
            this.fields.knife_config.classList.add("error");
        }
        if(this.fields.main_config.value === "false" || this.fields.main_config.value === false) {
            errors = true;
            this.fields.main_config.classList.add("error");
        }

        return errors;
    }

    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="starter-template">
                <h3>Create new match</h3>

                <div className="table-responsive">
                    <form>
                        <h4>Team 1</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" name="team-name-1" id="team-name-1" title="team-name-1" className="form-control" ref={c => this.fields.team1.name = c} /></td>
                                </tr>
                                <tr>
                                    <td>Country Code</td>
                                    <td>
                                        <select name="team-country-1" id="team-country-1" title="team-country-1" className="form-control" ref={c => this.fields.team1.country = c}>
                                            <option selected disabled value="false">Select country</option>
                                            {getIsoCodes().map((code, index) => (
                                                <option key={index} value={code.code}>{code.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Team 2</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Name</td>
                                    <td><input type="text" name="team-name-2" id="team-name-2" title="team-name-2" className="form-control" ref={c => this.fields.team2.name = c} /></td>
                                </tr>
                                <tr>
                                    <td>Country Code</td>
                                    <td>
                                        <select name="team-country-2" id="team-country-2" title="team-country-2" className="form-control" ref={c => this.fields.team2.country = c}>
                                            <option selected disabled value="false">Select country</option>
                                            {getIsoCodes().map((code, index) => (
                                                <option key={index} value={code.code}>{code.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>General Match Settings</h4>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Match Group</td>
                                    <td>
                                        <select title="match-group" name="match-group" id="match-group" className="form-control" ref={c => this.fields.match_group = c}>
                                            <option selected disabled value="false">Select a group</option>
                                            {this.state.groups.map((group, index) => (
                                                <option key={index} value={group}>{group}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Server</td>
                                    <td>
                                        <select title="server" name="server" id="server" className="form-control" onChange={() => this.updateMapField()} ref={c => this.fields.server = c}>
                                            <option selected disabled value="false">Select a server</option>
                                            {this.state.servers.map((server, index) => (
                                                <option key={index} value={`${server.ip}:${server.port}`}>{`${server.ip}:${server.port}`}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Default Server Map</td>
                                    <td><input type="text" name="map" title="map" id="map" className="form-control" value={this.state.map} ref={c => this.fields.map = c} disabled/></td>
                                </tr>
                                <tr>
                                    <td>CSGO Knife Config</td>
                                    <td>
                                        <select title="csgo-knife-config" name="csgo-knife-config" id="csgo-knife-config" className="form-control" ref={c => this.fields.knife_config = c}>
                                            <option selected disabled value="false">Select a config</option>
                                            {this.state.configs.knife.map((config, index) => (
                                                <option key={index} value={config}>{config}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>CSGO Main Config</td>
                                    <td>
                                        <select title="csgo-main-config" name="csgo-main-config" id="csgo-main-config" className="form-control" ref={c => this.fields.main_config = c}>
                                            <option selected disabled value="false">Select a config</option>
                                            {this.state.configs.main.map((config, index) => (
                                                <option key={index} value={config}>{config}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><button type="button" className="btn btn-lg btn-success" id="submit" onClick={() => this.createMatch()}>Create</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        );
    }
}
