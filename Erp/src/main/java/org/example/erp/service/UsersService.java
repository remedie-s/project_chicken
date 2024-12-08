package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.UsersDto;
import org.example.erp.entity.Users;
import org.example.erp.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {
    private final UsersRepository usersRepository;
    
    // 유저 리스트 보기 메소드
    public List<Users> findAll() {
        return usersRepository.findAll();

    }
    
    // 유저 상세보기 메소드
    public Users findById(Long id) {
        Optional<Users> byId = this.usersRepository.findById(id);
        if (byId.isPresent()) {
            return byId.get();
        }
        return null;
    }

    // 유저 관리 메소드
    public boolean modify(UsersDto userdto) {
        Optional<Users> byId = this.usersRepository.findById(userdto.getId());
        if (byId.isPresent()) {
            Users user = byId.get();
            user.setName(userdto.getName());
            user.setEmail(userdto.getEmail());
            user.setPassword(userdto.getPassword());
            user.setAddress(userdto.getAddress());
            user.setUserGrade(userdto.getUserGrade());
            this.usersRepository.save(user);
            return true;

        }
        return false;
    }

    // 유저 등급변경 - 강제로
    public Users save(Users users) {
        return this.usersRepository.save(users);

    }


    // 유저 삭제
    public boolean delete(Long id) {
        Optional<Users> byId = this.usersRepository.findById(id);
        if (byId.isPresent()) {
            this.usersRepository.delete(byId.get());
            return true;
        }
        return false;
    }

}
