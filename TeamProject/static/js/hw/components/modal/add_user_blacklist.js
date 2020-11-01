import modal from "./add_category";

const modal = `<div class='blacklist_modal_back manager_modal_back'>
										<div class='blacklist_modal manager_modal'>
											<div class='blacklist_exit manager_exit'>X</div>
											<div>
												<div class='modal_title'>회원 정지</div>
												<select class='blacklist_option'>
													<option value='3'>3일</option>
													<option value='7'>7일</option>
													<option value='30'>30일</option>
													<option value='100'>영구</option>				
												</select>
												<button class='blacklist_btn'>정지</button>
											</div>
										</div>
                                        </div>`;
                                        
export default modal;