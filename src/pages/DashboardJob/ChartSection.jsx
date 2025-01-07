import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import ReactApexChart from "react-apexcharts"
//import components
import { JobWidgetCharts } from './JobCharts';
import { cryptoReports } from '../../common/data'

const chartsData = [
    {
        id: 1,
        title: "Today Bills",
        price: "14,487",
        perstangeValue: "18.89",
        badgeColor: "success",
        seriesData: [{
            name: "Job View",
            data: [36, 21, 65, 22, 35, 50, 87, 98],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 2,
        title: "Approved Bills",
        price: "7,402",
        perstangeValue: "24.07",
        badgeColor: "success",
        seriesData: [{
            name: "New Application",
            data: [36, 48, 10, 74, 35, 50, 70, 73],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 3,
        title: "Waiting For Confirmation",
        price: "12,487",
        perstangeValue: " 8.41",
        badgeColor: "success",
        seriesData: [{
            name: "Total Approved",
            data: [60, 14, 5, 60, 30, 43, 65, 84],
        }],
        color: '["--bs-success", "--bs-transparent"]'
    },
    {
        id: 4,
        title: "Shipped Orders",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "Total Rejected",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
    {
        id: 5,
        title: "Proforma Invoice",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "Total Rejected",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
    {
        id: 6,
        title: "Goods Return",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "Total Rejected",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
    {
        id: 7,
        title: "GRV Waiting for Approval",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "GRV Waiting for Approval",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
    {
        id: 8,
        title: "Stock Details",
        price: "12,487",
        perstangeValue: " 20.63",
        badgeColor: "danger",
        istrendingArrow: true,
        seriesData: [{
            name: "Stock Details",
            data: [32, 22, 7, 55, 20, 45, 36, 20],
        }],
        color: '["--bs-danger", "--bs-transparent"]'
    },
];

const ChartSection = () => {

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
                                        <h4 className="mb-0">{item.price}</h4>
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