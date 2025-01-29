import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ReactApexChart from "react-apexcharts"
import axios from 'axios';
//import components
import { JobWidgetCharts } from './JobCharts';
import { cryptoReports } from '../../common/data'



const ChartSection = () => {
    const [chartsData, setChartsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token")


    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_KEY}dashboard/`,{
                    headers: { Authorization: `Bearer ${token}` } 
                });
                setChartsData(response.data.data);
                console.log(response.data.data)
                setLoading(false);
            } catch (error) {
                console.error('Error fetching chart data:', error);
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <React.Fragment>
            <Row className="d-flex flex-wrap">
                {(cryptoReports || []).map((report, key) => (
                    <Col sm={6} md={4} lg={4} key={key} className="mb-4">
                        <Card>
                            <CardBody>
                                <p className="text-muted mb-4">
                                    <i className={report.icon + " h2 text-" + report.color + " align-middle mb-0 me-3"} />
                                    {report.title}
                                </p>
                                <Row>
                                    <Col xs={6}>
                                        <div>
                                            <h5>{report.value}</h5>
                                            <p className="text-muted text-truncate mb-0">
                                                {report.desc} <i className={report.arrowUpDown} />
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div>
                                            <ReactApexChart options={report.options} series={report.series} type="area" height={40} className="apex-charts" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                {(chartsData || []).map((item, key) => (
                    <Col lg={3} key={key}>
                        <Card className="mini-stats-wid">
                            <CardBody>
                                <div className="d-flex">
                                    <div className="flex-grow-1">
                                        <p className="text-muted fw-medium">{item.title}</p>
                                        <h4 className="mb-0">{item.order}</h4>
                                    </div>

                                    <div className="flex-shrink-0 align-self-center">
                                        <JobWidgetCharts dataColors={item.color} series={item.seriesData} dir="ltr" />
                                    </div>
                                </div>
                            </CardBody>
                            {item.istrendingArrow ? <div className="card-body border-top py-3">
                                <p className="mb-0"> <span className={"badge badge-soft-" + item.bagdeColor + " me-2"}>
                                    <i className="bx bx-trending-down align-bottom me-1"></i> {item.perstangeValue}%</span>
                                    Decrease last month</p>
                            </div>
                                :
                                <div className="card-body border-top py-3">
                                    <p className="mb-0"> <span className={"badge badge-soft-" + item.bagdeColor + " me-2"}>
                                        <i className="bx bx-trending-up align-bottom me-1"></i> {item.perstangeValue}%</span>
                                        Increase last month</p>
                                </div>
                            }

                        </Card>
                    </Col>
                ))}
            </Row>
        </React.Fragment>
    );
}

export default ChartSection;