import axios from 'axios';
import '../Css/Search.css';
import React, { useActionState, useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Typography, Divider, Button, Image, Empty, Spin } from 'antd'
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const handleSubmit = (params, formvalue) => {
    return formvalue.get("searching")
}

const Search = () => {

    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [totalHeadDetail, setTotalHeadDetail] = useState([])
    const [totalDetail, setTotalDetail] = useState([])
    const [dbStoringHeads, setDbStoringDatas] = useState([])
    const { dynamicURL, spentTime, setSpentTime } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const scrapFunction = (formValue) => {
        if (pending || !formValue) return;
        try {
            let URL = `https://scrapping-node-server.vercel.app/scrap/search`;
            const timeSpent = (Date.now() - spentTime) / 1000;
            setIsLoading(true)
            axios.post(URL, { formData: formValue }).then((val) => {
                if (Object.entries(val.data).length > 0) {
                    setIsLoading(false)
                    setSpentTime(Date.now());
                    setTotalHeadDetail(val?.data?.totalHeadDetail);
                    setTotalDetail(val?.data?.totalDetail);
                    setDbStoringDatas(val?.data?.dbStoringHeadsAndURL);
                }
                axios.post("https://scrapping-node-server.vercel.app/db/heads", {
                    timer: timeSpent,
                    dbStoringHeadsAndURL: val?.data?.dbStoringHeadsAndURL,
                }).then(res => console.log(res.data));
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => { // get scrapped Data
        scrapFunction(dynamicURL ? dynamicURL : formValue)
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
                                                    <Row span={24} style={{marginLeft:'10px'}}><Typography.Link href={totalHeadDetail?.name} target="_blank" copyable>{totalHeadDetail?.URLName}</Typography.Link></Row>
                                                    
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col span={24}>
                                                    <Row className='scrapResultHead'>Titles</Row>
                                                    {totalHeadDetail?.data?.map((val) => {
                                                        return val?.paragraphs?.length > 0 && <Row style={{marginLeft:'10px'}}>
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
                    : <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />}
            </div >
        </main>
    )
}

export default Search