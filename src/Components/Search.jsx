import axios from 'axios';
import '../Css/Search.css';
import React, { useActionState, useContext, useEffect, useRef, useState } from 'react'
import { Row, Col, Typography, Divider, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

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
    const navigate = useNavigate()

    const scrapFunction = (formValue) => {
        if (pending || !formValue) return;
        try {
            let URL = `https://scrapping-node-server.vercel.app/scrap/search`;
            const timeSpent = (Date.now() - spentTime) / 1000;
            axios.post(URL, { formData: formValue }).then((val) => {
                setSpentTime(Date.now());
                setTotalHeadDetail(val?.data?.totalHeadDetail);
                setTotalDetail(val?.data?.totalDetail);
                setDbStoringDatas(val?.data?.dbStoringHeadsAndURL);

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
        <div className='SearchModule'>
            <Row justify={'space-around'}>
                <Col span={11} className='scrappedValueWithHeading'>
                    <Row className='inputSearchField'>
                        <Col span={24}>
                            <form action={submit}>
                                <input type="search" name="searching" id="searching" placeholder='Enter keywords...' onClick={() => navigate('/')} />
                                <Button
                                    type="primary"
                                    icon={<SearchOutlined />}
                                    htmlType="submit"
                                    className="searchButton"
                                ></Button>
                            </form>
                        </Col>
                    </Row>

                    <Row className='searchResult'>
                        <Col span={24}>
                            {!Array.isArray(totalHeadDetail) &&
                                <main>
                                    <Row style={{ padding: "10px 0" }}>
                                        <Typography.Link href={totalHeadDetail?.name} target="_blank" copyable>{totalHeadDetail?.URLName}</Typography.Link>
                                    </Row>

                                    <Row>
                                        <Col>
                                            {totalHeadDetail?.data?.map((val) => {
                                                return val?.paragraphs?.length > 0 && <Row>
                                                    <Col span={24}>
                                                        <Row>
                                                            <Typography.Title level={4}><span style={{ color: '#4ca30d', fontWeight: '400' }}>{val.heading}</span></Typography.Title>
                                                        </Row>
                                                        {val?.paragraphs?.map((paraValue) => {
                                                            return <Row style={{ marginLeft: '10px' }}><Typography.Paragraph> <p style={{ fontWeight: '200' }}> {paraValue} </p></Typography.Paragraph></Row>
                                                        })}
                                                        <Divider style={{ borderColor: '#4ca30d' }} />
                                                    </Col>
                                                </Row>
                                            })}
                                        </Col>
                                    </Row>
                                </main>
                            }
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
        </div >
    )
}

export default Search