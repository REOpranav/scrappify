import { Col, Row, Image, Button, Tooltip, Spin, Avatar, Typography, Divider } from 'antd'
import React, { useActionState, useContext, useEffect, useState } from 'react'
import '../Css/ListSearch.css'
import { UserContext } from '../App'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { FastBackwardFilled, LoadingOutlined, SearchOutlined } from '@ant-design/icons'

const isURL = (input) => { // checking Incoming params is URL or not 
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(input.trim());
}

const ListSearch = () => {
    const handleSubmit = (params, formvalue) => {
        let value = formvalue.get("searching")
        setDynamicURL(value)
        return value
    }

    const { setDynamicURL, dynamicURL } = useContext(UserContext)
    const [formValue, submit, pending] = useActionState(handleSubmit, "");
    const [searchingList, setSearchingList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [geminiResponceStatus, setGeminiResponceStatus] = useState(false)
    const [geminiResponceIndicator, setGeminiResponceIndicator] = useState(false)
    const [DbResponceIndicator, setDbResponceIndicator] = useState(false)

    const navigate = useNavigate()
    const URL = `https://scrapping-node-server.vercel.app/scrap/search`

    // scrpping function
    const scrapping = (URL, formValue) => {
        setDynamicURL(formValue)
        try {
            if (pending || !formValue) return;
            if (isURL(formValue)) {
                dynamicScrapURL(formValue)
                return
            }
            setIsLoading(true)
            setDbResponceIndicator(true)
            axios.post(URL, { formData: formValue }).then((val) => {
                if (Array.isArray(val.data)) {
                    setSearchingList(val?.data)
                    setIsLoading(false)
                    setGeminiResponceStatus(false)
                    setDbResponceIndicator(false)
                } else if (typeof val.data == 'object') {
                    setDbResponceIndicator(false)
                    setGeminiResponceIndicator(true)
                    setTimeout(() => {
                        setSearchingList(val?.data);
                        setIsLoading(false)
                        setGeminiResponceStatus(true)
                        setGeminiResponceIndicator(false)
                    }, 2 * 1000)
                }
            });

        } catch (err) {
            console.log(err);
        }
    }

    // gett scrapped Data 
    useEffect(() => {
        scrapping(URL, dynamicURL)
    }, [formValue])

    //this code navigate to seach page and scrap the current URL given by DB 
    const dynamicScrapURL = (scrappingURL) => {
        setDynamicURL(scrappingURL)
        navigate('/search')
    }

    console.log(searchingList);


    return (
        <div className='listSearch'>
            <main className='searchListMain'>
                <Row className='inputSearchFieldSearch'>
                    <Col span={24}>
                        <form action={submit}>
                            <input type="search" name="searching" className='searching' placeholder='https://example.com || Key word' />
                            <Button
                                type="primary"
                                icon={<SearchOutlined />}
                                htmlType="submit"
                                className="searchButton"
                            ></Button>

                        </form>
                    </Col>
                </Row>
                <Row className='searchResultListMain'>
                    <Col span={24}>
                        {!isLoading ? <>
                            {!geminiResponceStatus ? <>
                                {searchingList?.length > 0 ? searchingList.map((value) => {
                                    return <Tooltip title={"View Details"} placement='bottomLeft' color='blue'>
                                        <Row className='searchResultList'>
                                            <Col span={24}>
                                                <Row>
                                                    <Col span={16}>
                                                        <Row><a href={value.URLName} target='_blank'>{value.URLName}</a></Row>
                                                        <Row onClick={() => dynamicScrapURL(value.URLName)}>
                                                            <ul>
                                                                {value?.heading[0].map((value) => {
                                                                    return <li className='listValueName'>{value}</li>
                                                                })}
                                                            </ul>
                                                        </Row>
                                                    </Col>
                                                    <Col span={8} className='imagesHead'>
                                                        {value.images.map(img => {
                                                            return <Row className='imagesRow'>
                                                                <Image src={img} className='image' style={{ minHeight: '100px', maxHeight: '100px', minWidth: '100px', maxWidth: '100px' }} preview={true}></Image>
                                                            </Row>
                                                        })}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Tooltip>
                                }) : <Row className='notFoundImagesRow'>
                                    <Col span={24} className='notFoundImageColum'>
                                        <Row className='notFoundImageColumRowText'>We can't seem to find the page you are looking for.</Row>
                                        <Row><Image src={'https://www.zoho.com/images/zoho-404-video.gif'} className='noResultImage' preview={true}></Image></Row>
                                    </Col>
                                </Row>} </>

                                // This code is for searching List using ( gemini responce )
                                : <Row>
                                    <Col span={24}>
                                        <Row justify={'space-between'} className='llmResponce'>
                                            <Col>LLM Responce</Col>
                                            <Col>{searchingList?.prompt} - Gemini</Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{ marginLeft: '10px' }}>
                                        <Row style={{ padding: "10px 0" }}>
                                            <Col span={24}>
                                                <Row className='scrapResultLink'>For More Detail</Row>
                                                <Row style={{ marginLeft: '10px' }}><Typography.Link to={searchingList?.URL} target='_blank' copyable>{searchingList?.URL}</Typography.Link></Row>
                                            </Col>
                                        </Row>

                                        <Row className='scrapResultLink'>Key Areas ...</Row>
                                        <Row>
                                            <Col span={24}>
                                                <ul>
                                                    {searchingList?.paras?.map((val) => {
                                                        return <li> <Row className='GeminiListSearch'>
                                                            {val}
                                                        </Row>
                                                        </li>
                                                    })}
                                                </ul>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>} </>

                            :
                            // this is loading code
                            <Row className='notFoundImagesRow'>
                                <Col span={24} className='notFoundImageColum'>
                                    {DbResponceIndicator && <Row className='indicatorSText fade-in'><Col><Row justify={'center'}>Searching in history about <span style={{ color: 'red', marginLeft: '5px' }}>{dynamicURL}</span></Row></Col></Row>}
                                    {geminiResponceIndicator && <Row>
                                        <Col span={24}>
                                            <Row justify={'center'} className='indicatorSText fade-in'><Col span={24}><Row justify={'center'}> No relevant data found in the database.</Row> <Row justify={'center'}>Searching using LLM...</Row></Col></Row>
                                        </Col>
                                    </Row>}
                                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                                </Col>
                            </Row>
                        }
                    </Col>
                </Row>
            </main >
        </div >

    )
}

export default ListSearch

// timerResult.current = ((Date.now() - runningTimer.current) / 1000).toFixed(2) // this code follow the time Spend for every request by user.(it only store the datas in DB when the time duration is more than 5 secounds)