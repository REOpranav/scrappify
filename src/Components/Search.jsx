import axios from 'axios';
import '../Css/Search.css';
import React, { useActionState, useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Typography, Divider, Button, Image, Empty, Spin } from 'antd'
import { LoadingOutlined, LoginOutlined, SearchOutlined } from '@ant-design/icons'
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const handleSubmit = (params, formvalue) => {
    return formvalue.get("searching")
}

const Search = () => {

    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [totalHeadDetail, setTotalHeadDetail] = useState([])
    const [totalDetail, setTotalDetail] = useState([])
    const { dynamicURL, spentTime, setSpentTime, potencialURL } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false) // indication loading...
    const callOnceUseEffect = useRef(false) // this will help to prevent multiple render at a timer
    const navigate = useNavigate()

    const scrapFunction = async (formValue) => {
        if (pending || !formValue) return;

        const URL = `https://scrapping-node-server.vercel.app/scrap/search`
        const dbURL = `https://scrapping-node-server.vercel.app/db/heads`
        const timeSpent = (Date.now() - spentTime) / 1000

        try {
            setIsLoading(true);

            const previousDBStoringData = potencialURL?.current;
            const response = await axios.post(URL, { formData: formValue })
            const data = response.data
            const currentDBStoringData = data?.dbStoringHeadsAndURL


            if (Object.keys(data).length > 0) {
                setSpentTime(Date.now())
                setTotalHeadDetail(data.totalHeadDetail)
                setTotalDetail(data.totalDetail)
                setIsLoading(false);
            }

            console.log("Current: ", currentDBStoringData);
            console.log("Previous: ", previousDBStoringData);

            if (previousDBStoringData) { // this code is DB post request
                await axios.post(dbURL, {
                    timer: timeSpent,
                    dbStoringHeadsAndURL: previousDBStoringData
                });
            }

            potencialURL.current = currentDBStoringData
        } catch (err) {
            console.error("Scrap failed:", err);
        }
    };

    useEffect(() => { // get scrapped Data
        if (!callOnceUseEffect.current) { // this is for reducing the number of rendering when mount
            scrapFunction(dynamicURL ? dynamicURL : formValue)
            callOnceUseEffect.current = true
        }
    }, [formValue, dynamicURL])


    return (
        <main className='SearchModuleHead'>
            <div className='SearchModule'>
                <Row className='inputSearchField' justify={'space-between'}>
                    <Button type="primary"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                        onClick={() => navigate('/')}
                    >
                        Back to Search
                    </Button>
                </Row>
                {!isLoading ? <>
                    {!Array.isArray(totalHeadDetail) ?
                        <Row justify={'space-between'} className='searchModuleSecoundSection'>
                            <Col span={11} className='scrappedValueWithHeading'>
                                <Row className='searchResult'>
                                    <Col span={24}>
                                        <main>
                                            <Row style={{ padding: "10px 0" }}>
                                                <Col>
                                                    <Row className='scrapResultLink'>Official Link</Row>
                                                    <Row span={24} style={{ marginLeft: '10px' }}><Typography.Link href={totalHeadDetail?.name} target="_blank" copyable>{totalHeadDetail?.URLName}</Typography.Link></Row>

                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    {totalHeadDetail?.data[0].length > 0 && <Row className='scrapResultHead'>Titles</Row>}
                                                    {totalHeadDetail?.data?.map((val) => {
                                                        return val?.paragraphs?.length > 0 && <Row style={{ marginLeft: '10px' }}>
                                                            <Col span={24}>
                                                                <Row>
                                                                    <Typography.Title level={4}><span style={{ color: '#4ca30d', fontWeight: '400' }}>{val.heading}</span></Typography.Title>
                                                                </Row>
                                                                {val?.paragraphs?.map((paraValue) => {
                                                                    return <Row><Typography.Paragraph> <p style={{ fontWeight: '200' }}> {paraValue} </p></Typography.Paragraph></Row>
                                                                })}
                                                                <Divider style={{ borderColor: '#4ca30d' }} />
                                                            </Col>
                                                        </Row>
                                                    })}
                                                </Col>
                                            </Row>
                                        </main>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={12} className='scrappedValueWithParas'>
                                <Row className='HeadParas'>Key Areas ...</Row>
                                <Row className='paraResult'>
                                    <Col span={24}>
                                        {totalDetail?.paras?.map((val) => {
                                            return val !== '' && <Row>
                                                <Col span={24}>
                                                    <Row>{val}</Row>
                                                    <Divider style={{ borderColor: '#ddd' }} />
                                                </Col>
                                            </Row>
                                        })}
                                    </Col>
                                </Row>
                            </Col>
                        </Row >
                        : <Row className='notFoundImagesRow'>
                            <Col span={24} className='notFoundImageColum'>
                                <Row className='notFoundImageColumRowText'>We can't seem to find the page you are looking for.</Row>
                                <Row><Image src={'https://www.zoho.com/images/zoho-404-video.gif'} className='noResultImage'></Image></Row>
                            </Col>
                        </Row>} </>
                    :
                    <Row className='notFoundImagesRow'>
                        <Col span={24} className='notFoundImageColum'>
                            <Row className='indicatorSText fade-in'><Col><Row justify={'center'}>Scraping data from the web...</Row></Col></Row>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        </Col>
                    </Row>
                }
            </div >
        </main>
    )
}

export default Search